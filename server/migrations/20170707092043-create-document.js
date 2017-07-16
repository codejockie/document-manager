module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Documents', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER
    },
    title: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true
    },
    content: {
      allowNull: false,
      type: Sequelize.TEXT
    },
    author: {
      type: Sequelize.STRING
    },
    access: {
      allowNull: false,
      type: Sequelize.ENUM,
      values: ['private', 'public']
    },
    date_published: {
      allowNull: false,
      defaultValue: new Date(),
      type: Sequelize.DATE
    },
    date_updated: {
      allowNull: true,
      type: Sequelize.DATE
    },
    userId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId'
      },
    },
    roleId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      defaultValue: 2,
      references: {
        model: 'Roles',
        key: 'id',
        as: 'roleId'
      }
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: Sequelize.DATE
  }),
  down: queryInterface => queryInterface.dropTable('Documents'),
};
