module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Roles', [{
    name: 'Admin',
    createdAt: new Date()
  }, {
    name: 'User',
    createdAt: new Date()
  }, {
    name: 'Editor',
    createdAt: new Date()
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('Roles', null, {})
};
