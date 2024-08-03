'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 修改列名sex为gender
    await queryInterface.renameColumn('users', 'sex', 'gender');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('users', 'gender', 'sex');
  }
};
