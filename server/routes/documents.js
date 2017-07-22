import express from 'express';
import { isEqual } from '../helpers/helper';
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
          data: newDoc
        }))
        .catch(error => res.status(400).send(error));
    });
});

router.get('/', (req, res) => {
  let options;
  if ((req.query.limit !== undefined && req.query.limit !== '')
    && (req.query.offset !== undefined && req.query.offset !== '')) {
    const limit = parseInt(req.query.limit, 10);
    const offset = parseInt(req.query.offset, 10);

    if (isNaN(limit) || isNaN(offset)) {
      return res.status(400).send({
        status: 'error',
        message: 'Limit and Offset params must be numbers'
      });
    }

    options = {
      offset,
      limit,
    };
  } else {
    options = {};
  }

  Document.findAll(options)
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
        data: documents
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
      if (!isEqual(document.userId, req.user.id)) {
        return res.status(401).send({
          status: 'error',
          message: 'Unauthorised user. You don\'t have permission to access this document'
        });
      }

      return res.status(200).send(document);
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

      if (!isEqual(document.userId, req.user.id)) {
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
              data: document
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

      if (!isEqual(document.userId, req.user.id)) {
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
