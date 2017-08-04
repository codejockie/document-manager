import { formatDate } from '../helpers/helper';

export default (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return formatDate(this.getDataValue('createdAt'));
      },
    },
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return formatDate(this.getDataValue('updatedAt'));
      },
    }
  });

  Role.associate = (models) => {
    Role.hasMany(models.User, {
      foreignKey: 'roleId',
      as: 'users'
    });
    Role.hasMany(models.Document, {
      foreignKey: 'roleId',
      as: 'documents'
    });
  };
  return Role;
};
