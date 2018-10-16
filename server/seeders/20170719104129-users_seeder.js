const dotenv = require('dotenv'),
  bcrypt = require('bcrypt');

dotenv.config();
const salt = bcrypt.genSaltSync(13);

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Users', [{
    email: process.env.ADMIN_EMAIL,
    username: process.env.ADMIN_USERNAME,
    password: bcrypt.hashSync(process.env.PASSWORD, salt),
    firstname: process.env.FIRSTNAME,
    lastname: process.env.LASTNAME,
    roleId: 1,
    createdAt: new Date()
  }, {
    email: process.env.NON_ADMIN_EMAIL,
    username: process.env.NON_ADMIN_USERNAME,
    password: bcrypt.hashSync(process.env.PASSWORD, salt),
    firstname: process.env.FIRSTNAME,
    lastname: process.env.LASTNAME,
    roleId: 2,
    createdAt: new Date()
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
