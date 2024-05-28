'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Article.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Title字段必须传入"
        },
        notEmpty: {
          msg: "Title内容不能为空"
        },
        len: {
          args: [1, 100],
          msg: "Title长度必须在1到100之间"
        }
      }
    },
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};