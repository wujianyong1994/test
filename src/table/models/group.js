/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('group', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(12),
      allowNull: false
    },
    createTime: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    createUserId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'group'
  });
};
