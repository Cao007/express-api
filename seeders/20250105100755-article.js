'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const arr = []
    const counts = 100

    for (let i = 1; i <= counts; i++) {
      const article = {
        title: `文章的标题 ${i}`,
        content: `文章的内容 ${i}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      arr.push(article)
    }

    await queryInterface.bulkInsert('Articles', arr, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Articles', null, {})
  }
}
