module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles', [
      {
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
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Roles', null, {})
};
