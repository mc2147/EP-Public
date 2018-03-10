const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/AS_db', {
    logging: false
});

const Exercise = db.define('exercise', {
    name: {
        type: Sequelize.STRING
    },
    level: {
        type: Sequelize.INTEGER
    },
});

module.exports = {
	db: db,
	Exercise: Exercise
};