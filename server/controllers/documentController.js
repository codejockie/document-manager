import models from '../models';
import paginate from '../helpers/paginate';
import {
  generateDocumentObject,
  isUser
} from '../helpers/helper';
import {
  accessErrorMessage,
  serverErrorMessage
} from '../helpers/messages';

const { Document } = models;

export default {
  /**
   * Creates a new document
   * @param { Object } req
   * @param { Object } res
   * @returns { Object } document
   */
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
          .then(newDoc => res.status(201).send(generateDocumentObject(newDoc)))
          .catch(() => res.status(500).send({
            message: accessErrorMessage
          }));
      });
  },
  /**
   * Retrieves all documents
   * @param { Object } req
   * @param { Object } res
   * @returns { Array } documents
   */
  getAll(req, res) {
    const options = {
      attributes: {
        exclude: ['roleId']
      }
    };

    const currentUser = req.user.id;
    const role = req.user.roleId;

    if (role === 1) {
      options.where = {};
    } else {
      options.where = {
        $or: [
          { access: 'public' },
          { access: 'role',
            $and: {
              roleId: role
            }
          },
          { access: 'private',
            $and: {
              userId: currentUser
            }
          }
        ]
      };
    }

    options.offset = req.query.offset || 0;
    options.limit = req.query.limit || 10;

    Document.findAll(options)
      .then((documents) => {
        if (documents.length === 0) {
          return res.status(404).send({
            message: 'No document found'
          });
        }

        return res.status(200).send({
          metaData: paginate(options.limit, options.offset, documents.length),
          documents: documents.map(document => (generateDocumentObject(document)))
        });
      })
      .catch(() => res.status(500).send({
        message: serverErrorMessage
      }));
  },
  /**
   * Retrieves a document
   * @param { Object } req
   * @param { Object } res
   * @returns { Object } document
   */
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

        return res.status(200).send(generateDocumentObject(document));
      })
      .catch(() => res.status(500).send({
        message: serverErrorMessage
      }));
  },
  /**
   * Updates a document
   * @param { Object } req
   * @param { Object } res
   * @returns { Object } document
   */
  update(req, res) {
    Document.findById(req.params.id)
      .then((document) => {
        if (!isUser(document.userId, req.user.id)) {
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
              createdAt: document.createdAt,
              updatedAt: document.updatedAt
            })
              .then(() => res.status(201).send({
                document: generateDocumentObject(document)
              }))
              .catch(() => res.status(500).send({
                message: accessErrorMessage
              }));
          });
      });
  },
  /**
   * Deletes a document
   * @param { Object } req
   * @param { Object } res
   * @returns { Object } message
   */
  delete(req, res) {
    Document.findById(req.params.id)
      .then((document) => {
        if (!isUser(document.userId, req.user.id)) {
          return res.status(401).send({
            message: "Unauthorised user. You don't have permission to delete this document"
          });
        }

        return document.destroy()
          .then(() => res.status(200).send({
            message: 'Document deleted successfully'
          }));
      })
      .catch(() => res.status(500).send({ message: serverErrorMessage }));
  }
};
