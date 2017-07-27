import express from 'express';
import { formatDate, isAdmin, isUser } from '../helpers/helper';
import { validateDocument } from '../helpers/middleware';

const router = express.Router();

const Document = require('../models').Document;

router.post('/', validateDocument, (req, res) => {
  Document.findOne({
    where: {
      title: req.body.title
    }
  })
    .then((document) => {
      if (document) {
        return res.status(400).send({
          status: 'error',
          message: 'A document exist with the same title',
        });
      }

      Document.create({
        title: req.body.title,
        author: req.user.fullName,
        content: req.body.content,
        access: req.body.access,
        userId: req.user.id,
        roleId: req.user.roleId
      })
        .then(newDoc => res.status(201).send({
          status: 'ok',
          message: 'Document created successfully',
          data: {
            id: newDoc.id,
            title: newDoc.title,
            content: newDoc.content,
            access: newDoc.access,
            userId: newDoc.userId,
            roleId: newDoc.roleId,
            createdAt: formatDate(newDoc.createdAt),
          }
        }))
        .catch(error => res.status(400).send(error));
    });
});

router.get('/', (req, res) => {
  let limit, offset;
  if ((req.query.limit !== undefined && req.query.limit !== '')
    && (req.query.offset !== undefined && req.query.offset !== '')) {
    limit = parseInt(req.query.limit, 10);
    offset = parseInt(req.query.offset, 10);

    if (isNaN(limit) || isNaN(offset)) {
      return res.status(400).send({
        status: 'error',
        message: 'Limit and Offset params must be numbers'
      });
    }
  }

  Document.findAll({
    where: { userId: req.user.id },
    limit,
    offset
  })
    .then((documents) => {
      if (documents.length === 0) {
        return res.status(404).send({
          status: 'error',
          message: 'No document found'
        });
      }

      return res.status(200).send({
        status: 'ok',
        count: documents.length,
        data: documents.map(document => ({
          id: document.id,
          title: document.title,
          content: document.content,
          access: document.access,
          userId: document.userId,
          roleId: document.roleId,
          createdAt: formatDate(document.createdAt),
          updatedAt: formatDate(document.updatedAt),
        }))
      });
    })
    .catch(error => res.status(400).send(error));
});

router.get('/:id', (req, res) => {
  if (isNaN(req.params.id)) {
    return res.status(400).send({
      status: 'error',
      message: 'Param must be a number'
    });
  }

  Document.findById(req.params.id)
    .then((document) => {
      if (!document) {
        return res.status(404).send({
          status: 'error',
          message: 'Document not found'
        });
      }

      // Checks if the document owner's ID is
      // equal to the logged in user's ID
      if (!isUser(document.userId, req.user.id)) {
        return res.status(401).send({
          status: 'error',
          message: 'Unauthorised user. You don\'t have permission to access this document'
        });
      }

      return res.status(200).send({
        id: document.id,
        title: document.title,
        content: document.content,
        access: document.access,
        userId: document.userId,
        roleId: document.roleId,
        createdAt: formatDate(document.createdAt),
        updatedAt: formatDate(document.updatedAt),
      });
    })
    .catch(error => res.status(400).send(error));
});

router.put('/:id', (req, res) => {
  if (isNaN(req.params.id)) {
    return res.status(400).send({
      status: 'error',
      message: 'Document id must be a number'
    });
  }

  Document.findById(req.params.id)
    .then((document) => {
      if (!document) {
        return res.status(404).send({
          status: 'error',
          message: 'Document not found'
        });
      }

      if (!isAdmin(req.user.id) && !isUser(document.userId, req.user.id)) {
        return res.status(401).send({
          status: 'error',
          message: 'Unauthorised user. You don\'t have permission to update this document'
        });
      }

      Document.findAll({
        where: {
          title: req.body.title
        }
      })
        .then((existingDocument) => {
          if (existingDocument.length !== 0
            && (existingDocument[0].dataValues.id !== parseInt(req.params.id, 10))) {
            return res.status(400).send({
              status: 'error',
              message: 'A document exist with the same title'
            });
          }


          return document.update({
            title: req.body.title || document.title,
            content: req.body.content || document.content,
            author: req.user.fullName || document.author,
            access: req.body.access || document.access,
            userId: req.user.id || document.userId,
            roleId: req.user.roleId || document.roleId,
            createdAt: req.body.createdAt || document.createdAt,
            updatedAt: req.body.updatedAt || document.updatedAt
          })
            .then(() => res.status(201).send({
              status: 'ok',
              message: 'Document updated successfully',
              data: {
                id: document.id,
                title: document.title,
                content: document.content,
                access: document.access,
                userId: document.userId,
                roleId: document.roleId,
                createdAt: formatDate(document.createdAt),
                updatedAt: formatDate(document.updatedAt),
              }
            }))
            .catch(error => res.status(400).send(error));
        })
        .catch(error => res.send(error));
    })
    .catch(error => res.status(400).send(error));
});

router.delete('/:id', (req, res) => {
  if (isNaN(req.params.id)) {
    return res.status(400).send({
      status: 'error',
      message: 'Document id must be a number'
    });
  }

  Document.findById(req.params.id)
    .then((document) => {
      if (!document) {
        return res.status(404).send({
          status: 'error',
          message: 'Document not found'
        });
      }

      if (!isAdmin(req.user.id) && !isUser(document.userId, req.user.id)) {
        return res.status(401).send({
          status: 'error',
          message: 'Unauthorised user. You don\'t have permission to delete this document'
        });
      }

      return document.destroy()
        .then(() => res.status(200).send({
          status: 'ok',
          message: 'Document deleted successfully'
        }))
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
});

export default router;
