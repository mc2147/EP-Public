'use strict';

// sequelize db:migrate will run "up functions in these migrations, one after the other"
module.exports = {
  up: (queryInterface, Sequelize) => {
    // queryInterface is what changes database (queryInterface.addcolumn)
    // Sequelize is the one we know (it has data types associated with it from when we define models)
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.addColumn(
      'Videos',
      'exerciseCategory',
      {
        type: Sequelize.STRING,
        defaultValue: ''
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Videos',
      'exerciseCategory'
    )
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
