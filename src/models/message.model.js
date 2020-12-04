const Sequelize = require('sequelize');
const sequelize = require('../database/database');
module.exports = Message = sequelize.define('messages', {
	text_content: { type: Sequelize.STRING, allowNull: true },
	message_id: { type: Sequelize.STRING, allowNull: true },
	owner_fullname: { type: Sequelize.STRING, allowNull: true },
	replied_to_text: { type: Sequelize.STRING, allowNull: true },
	replied_to_id: { type: Sequelize.STRING, allowNull: true },
	removed: { type: Sequelize.BOOLEAN },
});
