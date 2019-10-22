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

/**
 * @class DocumentController
 */
export default class DocumentController {
  /**
   * Creates a new document
   * @param { Object } request
   * @param { Object } response
   * @returns { Object } document
   */
  static createDocument(request, response) {
    Document.findOne({
      where: {
        title: request.body.title
      }
    })
      .then((document) => {
        if (document) {
          return response.status(422).send({
            message: 'A document exist with the same title',
          });
        }

        Document.create({
          title: request.body.title,
          author: request.user.fullName,
          content: request.body.content,
          access: request.body.access,
          userId: request.user.id,
          roleId: request.user.roleId
        })
          .then(newDoc => response.status(201).send(generateDocumentObject(newDoc)))
          .catch(() => response.status(500).send({
            message: accessErrorMessage
          }));
      });
  }

  /**
   * Retrieves all documents
   * @param { Object } request
   * @param { Object } response
   * @returns { Array } documents
   */
  static getDocuments(request, response) {
    const options = {
      attributes: {
        exclude: ['roleId']
      }
    };

    const currentUser = request.user.id;
    const role = request.user.roleId;

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

    options.offset = request.query.offset || 0;
    options.limit = request.query.limit || 10;

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
   * @param { Object } request
   * @param { Object } response
   * @returns { Object } document
   */
  static getDocument(request, response) {
    Document.findById(request.params.id)
      .then((document) => {
        // Checks if the document owner's ID is
        // equal to the logged in user's ID
        if (!isUser(document.userId, request.user.id)) {
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
   * @param { Object } request
   * @param { Object } response
   * @returns { Object } document
   */
  static updateDocument(request, response) {
    Document.findById(request.params.id)
      .then((document) => {
        if (!isUser(document.userId, request.user.id)) {
          return response.status(401).send({
            message: "Unauthorised user. You don't have permission to update this document"
          });
        }

        Document.findAll({
          where: {
            title: request.body.title
          }
        })
          .then((existingDocument) => {
            if (existingDocument.length !== 0
              && (existingDocument[0].dataValues.id !== parseInt(request.params.id, 10))) {
              return response.status(422).send({
                message: 'A document exist with the same title'
              });
            }


            return document.update({
              title: request.body.title || document.title,
              content: request.body.content || document.content,
              author: request.user.fullName || document.author,
              access: request.body.access || document.access,
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
   * @param { Object } request
   * @param { Object } response
   * @returns { Object } message
   */
  static deleteDocument(request, response) {
    Document.findById(request.params.id)
      .then((document) => {
        if (!isUser(document.userId, request.user.id)) {
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
