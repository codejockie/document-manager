import models from '../models';
import { generateDocumentObject } from '../helpers/helper';

const Document = models.Document;
const User = models.User;
const serverErrorMessage = 'An error occurred while processing the request';

export default {
  /**
   * @description searches for occurrences of a user
   * @method
   * @param { Object } req
   * @param { Object } res
   * @returns { Array } users
   */
  searchUser(req, res) {
    const query = req.query.q.trim();

    User.findAll({
      where: {
        $or: [{
          username: {
            $iLike: `%${query}%`
          }
        }, {
          email: {
            $iLike: `%${query}%`
          }
        }]
      },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt']
      }
    })
      .then((users) => {
        if (users.length === 0) {
          return res.status(200).send({
            user: []
          });
        }

        return res.status(200).send({
          users: users.map(user => (
            {
              email: user.email,
              username: user.username
            }))
        });
      })
      .catch(() => res.status(500).send({ message: serverErrorMessage }));
  },
  /**
   * @description searches for occurrences of a document
   * @method
   * @param { Object } req
   * @param { Object } res
   * @returns { Array } documents
   */
  searchDocument(req, res) {
    const query = req.query.q.trim();

    Document.findAll({
      where: {
        title: { $iLike: `%${query}%` },
        $or: [{ access: 'public' }, { userId: req.user.id }]
      },
      attributes: {
        exclude: ['roleId']
      }
    })
      .then((documents) => {
        if (documents.length === 0) {
          return res.status(200).send({
            document: []
          });
        }
        return res.status(200).send({
          documents: documents.map(document => generateDocumentObject(document))
        });
      })
      .catch(() => res.status(500).send({ message: serverErrorMessage }));
  }
};
