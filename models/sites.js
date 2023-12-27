'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sites extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Sites.init({
    repo_name: DataTypes.STRING,
    status: DataTypes.STRING,
    port: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Sites',
  });
  return Sites;
};