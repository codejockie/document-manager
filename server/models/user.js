export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    token: {
      allowNull: false,
      type: DataTypes.STRING
    },
    roleId: {
      type: DataTypes.INTEGER
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Document, {
      foreignKey: 'userId',
      as: 'documents',
    });
    User.belongsTo(models.Role, {
      foreignKey: 'roleId',
      onDelete: 'CASCADE'
    });
  };
  return User;
};
