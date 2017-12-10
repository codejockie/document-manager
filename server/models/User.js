import { formatDate, hashPassword } from '../helpers/helper';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    firstname: {
      allowNull: false,
      type: DataTypes.STRING
    },
    lastname: {
      allowNull: false,
      type: DataTypes.STRING
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
    roleId: {
      type: DataTypes.INTEGER
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
  }, {
    getterMethods: {
      fullName() {
        return `${this.lastname} ${this.firstname}`;
      }
    }
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

  User.beforeCreate(user => hashPassword(user.password)
    .then((hash) => {
      user.password = hash;
    }));

  return User;
};
