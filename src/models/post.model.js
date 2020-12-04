const Sequelize = require('sequelize');
const sequelize = require('../database/database');
module.exports = Posts = sequelize.define('posts', {
	content: { type: Sequelize.STRING, allowNull: true },
	owner_id: { type: Sequelize.STRING, allowNull: true },
	post_id: { type: Sequelize.INTEGER, allowNull: true },
	media_type: { type: Sequelize.STRING, allowNull: true },
	media: { type: Sequelize.STRING, allowNull: true },
	removed: { type: Sequelize.BOOLEAN, allowNull: false },
	post_likes: { type: Sequelize.TEXT, allowNull: true },
	post_liked_users: { type: Sequelize.ARRAY(Sequelize.NUMBER), allowNull: true },
});
