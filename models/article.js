'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment/moment');
moment.locale('zh-cn');

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
      // 约束（数据库级别）
      allowNull: false,
      // 校验（纯js校验规则）
      validate: {
        notNull: {
          msg: '标题字段必传'
        },
        notEmpty: {
          msg: '标题内容不能为空'
        },
        len: {
          args: [2, 30],
          msg: '标题长度在2-30个字符之间'
        }
      }
    },
    content: DataTypes.TEXT,
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue("createdAt")).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue("updatedAt")).format("YYYY-MM-DD HH:mm:ss");
      }
    },
  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};