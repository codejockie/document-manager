import express from 'express';

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

  const query = (req.query.q).toString();

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
          data: []
        });
      }

      return res.status(200).send({
        status: 'ok',
        count: users.length,
        data: users.map(user => (
          {
            email: user.email,
            username: user.username
          }))
      });
    })
    .catch(error => res.status(400).send({
      status: 'error',
      error
    }));
});

router.get('/documents', (req, res) => {
  if (req.query.q === undefined || req.query.q === '') {
    return res.status(400).send({
      status: 'error',
      message: 'Query param is required'
    });
  }

  const query = (req.query.q).toString();

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
          data: []
        });
      }
      return res.status(200).send({
        status: 'ok',
        count: documents.length,
        data: documents
      });
    })
    .catch(error => res.status(400).send({
      status: 'error',
      error
    }));
});

export default router;
