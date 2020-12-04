const Sequelize = require('sequelize');
const sequelize = require('../database/database');
module.exports = User = sequelize.define('users', {
	first_name: {type: Sequelize.STRING, allowNull: false},
	last_name: {type: Sequelize.STRING},
	age: {type: Sequelize.INTEGER, allowNull: true},
	address: {type: Sequelize.STRING, allowNull: true},
	salary: {type: Sequelize.REAL, allowNull: true},
	login: {type: Sequelize.STRING, allowNull: false},
	password: {type: Sequelize.STRING, allowNull: false},
	is_active: {type: Sequelize.BOOLEAN},
	avatar_image: {type: Sequelize.STRING, allowNull: true}
});
