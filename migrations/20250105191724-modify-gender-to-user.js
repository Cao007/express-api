'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 将字段名sex修改为gender  
    await queryInterface.renameColumn('Users', 'sex', 'gender');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('Users', 'gender', 'sex');
  }
};
