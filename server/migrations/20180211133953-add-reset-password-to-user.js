module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.addColumn('Users', 'resetPasswordToken', Sequelize.STRING)
      .then(() => queryInterface.addColumn('Users', 'resetPasswordExpires', Sequelize.DATE))
  ),

  down: queryInterface => (
    queryInterface.removeColumn('Users', 'resetPasswordToken')
      .then(() => queryInterface.removeColumn('Users', 'resetPasswordExpires'))
  )
};
