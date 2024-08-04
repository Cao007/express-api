'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = [
      {
        id: 1,
        parentId: 0,
        title: '一级标题 1',
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        parentId: 1,
        title: '二级标题 1',
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        parentId: 1,
        title: '二级标题 2',
        rank: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        parentId: 2,
        title: '三级标题 1',
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        parentId: 2,
        title: '三级标题 2',
        rank: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        parentId: 0,
        title: '一级标题 2',
        rank: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]
    await queryInterface.bulkInsert('Trees', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Trees', null, {});
  }
};
