'use strict';

// sequelize db:migrate will run "up functions in these migrations, one after the other"
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Videos',
      'testing',
      {
        type: Sequelize.STRING,
        defaultValue: 'test'
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Videos',
      'testing'
    )
  }
};
