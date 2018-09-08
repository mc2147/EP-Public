'use strict';

// sequelize db:migrate will run "up functions in these migrations, one after the other"

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return queryInterface.addColumn('Users', 'notifiedMissedWorkouts', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },

  down: function down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('Users', 'notifiedMissedWorkouts');
  }
};