'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tree extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tree.init({
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: '父级ID必须填写。' },
        notEmpty: { msg: '父级ID不能为空。' },
        async isPresent(value) {
          if (value !== 0) {
            const page = await Page.findByPk(value)
            if (!page) {
              throw new Error(`ID为：${value} 的父级不存在。`);
            }
          }
        }
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '标题必须填写。'
        },
        notEmpty: {
          msg: '标题不能为空。'
        },
        len: {
          args: [2, 45],
          msg: '标题长度需要在2 ~ 45个字符之间。'
        }
      }
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: '排序必须填写。' },
        notEmpty: { msg: '排序不能为空。' },
        isInt: { msg: '排序必须为整数。' },
        isPositive(value) {
          if (value <= 0) {
            throw new Error('排序必须是正整数。');
          }
        }
      }
    },
    content: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Tree',
  });
  return Tree;
};