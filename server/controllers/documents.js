import models from '../models';
import { documentCreator, isAdmin, isUser } from '../helpers/helper';
import paginate from '../helpers/paginate';

const Document = models.Document;

export default {
  create(req, res) {
    Document.findOne({
      where: {
        title: req.body.title
      }
    })
      .then((document) => {
        if (document) {
          return res.status(422).send({
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
          .then(newDoc => res.status(201).send(documentCreator(newDoc)))
          .catch(() => res.status(400).send({ message: "Access field must be any of 'public' or 'private'" }));
      });
  },
  getAll(req, res) {
    Document.findAll()
      .then((response) => {
        const totalCount = response.length;
        const offset = req.query.offset || 0;
        const limit = req.query.limit || 10;

        return Document.findAll({
          where: {
            $or: [{
              userId: req.user.id
            }, {
              roleId: req.user.roleId
            }, {
              access: 'public'
            }]
          },
          offset,
          limit,
        })
          .then((documents) => {
            if (documents.length === 0) {
              return res.status(404).send({
                message: 'No document found'
              });
            }

            return res.status(200).send({
              metaData: paginate(limit, offset, totalCount),
              documents: documents.map(document => (documentCreator(document)))
            });
          });
      });
  },
  getOne(req, res) {
    Document.findById(req.params.id)
      .then((document) => {
        // Checks if the document owner's ID is
        // equal to the logged in user's ID
        if (!isUser(document.userId, req.user.id)) {
          return res.status(401).send({
            message: "Unauthorised user. You don't have permission to access this document"
          });
        }

        return res.status(200).send(documentCreator(document));
      });
  },
  update(req, res) {
    Document.findById(req.params.id)
      .then((document) => {
        if (!isAdmin(req.user.id) && !isUser(document.userId, req.user.id)) {
          return res.status(401).send({
            message: "Unauthorised user. You don't have permission to update this document"
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
              return res.status(422).send({
                message: 'A document exist with the same title'
              });
            }


            return document.update({
              title: req.body.title || document.title,
              content: req.body.content || document.content,
              author: req.user.fullName || document.author,
              access: req.body.access || document.access,
              userId: document.userId,
              roleId: document.roleId,
              createdAt: req.body.createdAt || document.createdAt,
              updatedAt: req.body.updatedAt || document.updatedAt
            })
              .then(() => res.status(201).send({
                document: documentCreator(document)
              }))
              .catch(() => res.status(400).send({ message: "Access field must be any of 'public' or 'private'" }));
          });
      });
  },
  delete(req, res) {
    Document.findById(req.params.id)
      .then((document) => {
        if (!isAdmin(req.user.id) && !isUser(document.userId, req.user.id)) {
          return res.status(401).send({
            message: "Unauthorised user. You don't have permission to delete this document"
          });
        }

        return document.destroy()
          .then(() => res.status(200).send({
            message: 'Document deleted successfully'
          }));
      });
  }
};
