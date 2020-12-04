const jwt = require('jsonwebtoken');
const util = {};
util.checkToken = (bearer) => {
	const [x, token] = bearer.split(' ');
	const decoded = jwt.decode(token);
	try {
		if (Date.now() >= decoded.exp * 1000) {
			return false;
		} else {
			return true;
		}
	} catch (error) {
		return false;
	}
};
util.getUserByToken = (token) => {
	try {
		const { user } = jwt.decode(token);
		if (!user) {
			return null;
		}
		return user;
	} catch (error) {
		return null;
	}
};
module.exports = util;
