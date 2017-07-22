module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Roles', [{
    name: 'admin',
    createdAt: new Date()
  }, {
    name: 'user',
    createdAt: new Date()
  }, {
    name: 'editor',
    createdAt: new Date()
  }, {
    name: 'publisher',
    createdAt: new Date()
  }, {
    name: 'moderator',
    createdAt: new Date()
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('Roles', null, {})
};
