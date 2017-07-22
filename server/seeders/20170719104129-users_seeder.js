const dotenv = require('dotenv'),
  bcrypt = require('bcryptjs');

dotenv.config();
const salt = bcrypt.genSaltSync(13);

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Users', [{
    email: process.env.EMAIL,
    username: process.env.USERNAME,
    password: bcrypt.hashSync(process.env.PASSWORD, salt),
    firstname: process.env.FIRSTNAME,
    lastname: process.env.LASTNAME,
    roleId: 1,
    createdAt: new Date()
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
