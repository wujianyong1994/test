/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user', {
    ID: {
      type: DataTypes.INTEGER(12),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    NAME: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    MOBILE: {
      type: DataTypes.STRING(16),
      allowNull: true
    }
  }, {
      tableName: 'user'
    });
};
