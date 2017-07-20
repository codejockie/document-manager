export default (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    title: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    content: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    access: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: ['private', 'public']
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    roleId: {
      type: DataTypes.INTEGER,
    },
  });

  Document.associate = (models) => {
    Document.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Document.belongsTo(models.Role, {
      foreignKey: 'roleId',
      onDelete: 'CASCADE'
    });
  };
  return Document;
};
