const Sequelize = require('sequelize');
const sequelize = require('../database/database');
module.exports = Comment = sequelize.define('comments', {
	text_content: { type: Sequelize.STRING, allowNull: true },
	comment_id: { type: Sequelize.STRING, allowNull: true },
	owner_id: { type: Sequelize.STRING, allowNull: true },
	replied_to_text: { type: Sequelize.STRING, allowNull: true },
	replied_to_id: { type: Sequelize.STRING, allowNull: true },
	removed: { type: Sequelize.BOOLEAN },
});
