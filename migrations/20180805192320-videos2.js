'use strict';

// sequelize db:migrate will run "up functions in these migrations, one after the other"
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Videos',
      'exerciseLevels',
      {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: []
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Videos',
      'exerciseLevels'
    )
  }
};
