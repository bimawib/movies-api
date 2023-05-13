'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // up: async (queryInterface, Sequelize) => {
  //   // Create a new table with the desired column order
  //   await queryInterface.createTable('new_movies', {
  //     id: {
  //       allowNull: false,
  //       autoIncrement: true,
  //       primaryKey: true,
  //       type: Sequelize.INTEGER
  //     },
  //     title: {
  //       type: Sequelize.STRING(150),
  //       allowNull: false
  //     },
  //     genres: {
  //       type: Sequelize.STRING(50),
  //       allowNull: false
  //     },
  //     year: {
  //       type: Sequelize.STRING(50),
  //       allowNull: false
  //     },
  //   });

  //   // Copy data from the old table to the new table
  //   await queryInterface.sequelize.query(`
  //     INSERT INTO new_movies (id, title, genres, year)
  //     SELECT id, title, genres, year
  //     FROM movies
  //   `);

  //   // Drop the old table
  //   await queryInterface.dropTable('movies');

  //   // Rename the new table to the original table name
  //   await queryInterface.renameTable('new_movies', 'movies');

  //   await queryInterface.sequelize.query('ALTER TABLE movies RENAME CONSTRAINT new_movies_pkey TO movies_pkey');

  //   // Update sequence name
  //   await queryInterface.sequelize.query('ALTER SEQUENCE new_movies_id_seq RENAME TO movies_id_seq');
  // },

  // down: async (queryInterface, Sequelize) => {
  //   // Remove the id column from the movies table
  //   // await queryInterface.removeColumn('movies', 'id');
  // },
};