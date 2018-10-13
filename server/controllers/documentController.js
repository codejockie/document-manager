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

export default class DocumentController {
  /**
   * Creates a new document
   * @param { Object } resquest
   * @param { Object } response
   * @returns { Object } document
   */
  static createDocument(resquest, response) {
    Document.findOne({
      where: {
        title: resquest.body.title
      }
    })
      .then((document) => {
        if (document) {
          return response.status(422).send({
            message: 'A document exist with the same title',
          });
        }

        Document.create({
          title: resquest.body.title,
          author: resquest.user.fullName,
          content: resquest.body.content,
          access: resquest.body.access,
          userId: resquest.user.id,
          roleId: resquest.user.roleId
        })
          .then(newDoc => response.status(201).send(generateDocumentObject(newDoc)))
          .catch(() => response.status(500).send({
            message: accessErrorMessage
          }));
      });
  }

  /**
   * Retrieves all documents
   * @param { Object } resquest
   * @param { Object } response
   * @returns { Array } documents
   */
  static getDocuments(resquest, response) {
    const options = {
      attributes: {
        exclude: ['roleId']
      }
    };

    const currentUser = resquest.user.id;
    const role = resquest.user.roleId;

    if (role === 1) {
      options.where = {};
    } else {
      options.where = {
        $or: [
          { access: 'public' },
          {
            access: 'role',
            $and: {
              roleId: role
            }
          },
          {
            access: 'private',
            $and: {
              userId: currentUser
            }
          }
        ]
      };
    }

    options.offset = resquest.query.offset || 0;
    options.limit = resquest.query.limit || 10;

    Document.findAll(options)
      .then((documents) => {
        if (documents.length === 0) {
          return response.status(404).send({
            message: 'No document found'
          });
        }

        return response.status(200).send({
          metaData: paginate(options.limit, options.offset, documents.length),
          documents: documents.map(document => (generateDocumentObject(document)))
        });
      })
      .catch(() => response.status(500).send({
        message: serverErrorMessage
      }));
  }

  /**
   * Retrieves a document
   * @param { Object } resquest
   * @param { Object } response
   * @returns { Object } document
   */
  static getDocument(resquest, response) {
    Document.findById(resquest.params.id)
      .then((document) => {
        // Checks if the document owner's ID is
        // equal to the logged in user's ID
        if (!isUser(document.userId, resquest.user.id)) {
          return response.status(401).send({
            message: "Unauthorised user. You don't have permission to access this document"
          });
        }

        return response.status(200).send(generateDocumentObject(document));
      })
      .catch(() => response.status(500).send({
        message: serverErrorMessage
      }));
  }

  /**
   * Updates a document
   * @param { Object } resquest
   * @param { Object } response
   * @returns { Object } document
   */
  static updateDocument(resquest, response) {
    Document.findById(resquest.params.id)
      .then((document) => {
        if (!isUser(document.userId, resquest.user.id)) {
          return response.status(401).send({
            message: "Unauthorised user. You don't have permission to update this document"
          });
        }

        Document.findAll({
          where: {
            title: resquest.body.title
          }
        })
          .then((existingDocument) => {
            if (existingDocument.length !== 0
              && (existingDocument[0].dataValues.id !== parseInt(resquest.params.id, 10))) {
              return response.status(422).send({
                message: 'A document exist with the same title'
              });
            }


            return document.update({
              title: resquest.body.title || document.title,
              content: resquest.body.content || document.content,
              author: resquest.user.fullName || document.author,
              access: resquest.body.access || document.access,
              userId: document.userId,
              roleId: document.roleId,
              createdAt: document.createdAt,
              updatedAt: document.updatedAt
            })
              .then(() => response.status(201).send({
                document: generateDocumentObject(document)
              }))
              .catch(() => response.status(500).send({
                message: accessErrorMessage
              }));
          });
      });
  }

  /**
   * Deletes a document
   * @param { Object } resquest
   * @param { Object } response
   * @returns { Object } message
   */
  static deleteDocument(resquest, response) {
    Document.findById(resquest.params.id)
      .then((document) => {
        if (!isUser(document.userId, resquest.user.id)) {
          return response.status(401).send({
            message: "Unauthorised user. You don't have permission to delete this document"
          });
        }

        return document.destroy()
          .then(() => response.status(200).send({
            message: 'Document deleted successfully'
          }));
      })
      .catch(() => response.status(500).send({ message: serverErrorMessage }));
  }
}
