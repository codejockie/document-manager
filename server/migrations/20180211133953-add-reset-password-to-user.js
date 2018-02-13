module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'resetPasswordToken', Sequelize.STRING);
    queryInterface.addColumn('Users', 'resetPasswordExpires', Sequelize.DATE);
  },

  down: (queryInterface) => {
    queryInterface.removeColumn('Users', 'resetPasswordToken');
    queryInterface.removeColumn('Users', 'resetPasswordExpires');
  }
};
