'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
