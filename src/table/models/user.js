/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    ID: {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    mobile: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    openid: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    nickname: {
      type: DataTypes.STRING(24),
      allowNull: true
    },
    sex: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    province: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    headimgurl: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    unionid: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    loginName: {
      type: DataTypes.STRING(12),
      allowNull: true
    }
  }, {
    tableName: 'user'
  });
};
