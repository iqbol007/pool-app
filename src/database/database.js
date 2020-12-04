const Sequelize = require('sequelize');
const sequelize = new Sequelize(
	'postgres://postgres:supreme@localhost:5432/postDataBase',
);
module.exports = autenticaceToDataBase = () => {
	sequelize
		.authenticate()
		.then(() => {
			console.log('Connection has been established successfully.');
		})
		.catch((err) => {
			console.error('Unable to connect to the database:', err);
		});
};
module.exports = sequelize;
