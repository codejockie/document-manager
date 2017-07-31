import express from 'express';
import { formatDate } from '../helpers/helper';


const router = express.Router();
const User = require('../models').User;
const Document = require('../models').Document;

router.get('/users', (req, res) => {
  if (req.query.q === undefined || req.query.q === '') {
    return res.status(400).send({
      status: 'error',
      message: 'Query param is required'
    });
  }

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
    }
  })
    .then((users) => {
      if (users.length === 0) {
        return res.status(200).send({
          status: 'ok',
          items: []
        });
      }

      return res.status(200).send({
        status: 'ok',
        count: users.length,
        items: users.map(user => (
          {
            email: user.email,
            username: user.username
          }))
      });
    });
});

router.get('/documents', (req, res) => {
  if (req.query.q === undefined || req.query.q === '') {
    return res.status(400).send({
      status: 'error',
      message: 'Query param is required'
    });
  }

  const query = req.query.q.trim();

  Document.findAll({
    where: {
      $and: {
        title: {
          $iLike: `%${query}%`
        },
        $or: [
          {
            access: 'public',
          },
        ]
      }
    },
    order: [['createdAt', 'DESC']]
  })
    .then((documents) => {
      if (documents.length === 0) {
        return res.status(200).send({
          status: 'ok',
          items: []
        });
      }
      return res.status(200).send({
        status: 'ok',
        count: documents.length,
        items: documents.map(document => ({
          id: document.id,
          title: document.title,
          content: document.content,
          author: document.author,
          access: document.access,
          user_id: document.userId,
          role_id: document.roleId,
          created_at: formatDate(document.createdAt),
          updated_at: formatDate(document.updatedAt)
        }))
      });
    });
});

export default router;
