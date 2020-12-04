const { Router } = require('express');
const router = Router();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const util = require('../utils/utils');
User.sync();

/*CREATE USER*/
router.post('/createUser', async (req, res) => {
	try {
		const newUser = new User({
			...req.body,
			password: bcrypt.hashSync(req.body.password),
		});

		await newUser.save();
		const { first_name, last_name, salary, address } = newUser;
		res.json({ user: { first_name, last_name, salary, address } });
		return;
	} catch (error) {
		res.send({ message: 'err.internal', code: 500 });
		return;
	}
});

/*AUTHENTICATE USER*/
router.post('/authenticate', async (req, res) => {
	try {
		const { login, password } = req.body;
		const user = await User.findOne({
			where: {
				login,
			},
		});
		if (!user) {
			res
				.status(404)
				.send({ message: 'No users found with this login and password' });
			return;
		}
		const match = bcrypt.compareSync(password, user.password);
		if (!match) {
			res
				.status(401)
				.send({ message: 'Unauthorized, wrong login or password' });
			return;
		}
		const token = jwt.sign(
			{
				user: {
					id: user.id,
					first_name: user.first_name,
					last_name: user.last_name,
					age: user.age,
					salary: user.salary,
					avatar_image: user.avatar_image,
				},
			},
			'secret',
			{
				expiresIn: '10h',
			},
		);
		res.send({ token });
		return;
	} catch (error) {
		res.status(500).send({ message: 'Internal Server Error' });
	}
});
/*USER BY ID*/
router.get('/userById', async (req, res) => {
	const { id } = req.query;
	console.log(id);
	try {
		const user = await User.findOne({
			where: {
				id,
			},
		});
		res.json({ user });
	} catch (error) {
		console.error(error);
	}
});
/*ALL USERS*/

router.get('/all', (req, res) => {
	const isValidToken = util.checkToken(req.headers.authorization);
	if (!isValidToken) {
		res.status(401).send({ message: 'token expiried' });
		return;
	}
	User.findAll()
		.then((data) => {
			res.send({ users: data });
		})
		.catch((err) => {
			res.status(500).send({
				message:
					err.message || 'Some error occurred while retrieving tutorials.',
			});
		});
});
/*FILTERS*/
router.get('/get', (req, res) => {});
/*UPDATE USER*/
router.put('/updateUser', async (req, res) => {
	try {
		const isValidToken = util.checkToken(req.headers.authorization);
		if (!isValidToken) {
			res.status(401).send({ message: 'token expiried' });
		}
		const { id } = req.query;
		const { first_name, last_name, login, password, age, salary } = req.body;

		if (!id || Number.isNaN(Number(id))) {
			res.status(400).send({ message: 'Wrong id 🤣' });
		}
		const params = {
			first_name,
			last_name,
			login,
			password: password ? bcrypt.hashSync(password) : undefined,
			age,
			salary,
		};
		/**
		 * Remove items from object if there has undefined value
		 */
		const parsed = Object.entries(params).reduce((acc, [key, value]) => {
			if (value !== undefined) {
				acc[key] = value;
				return acc;
			} else {
				return acc;
			}
		}, {});

		const user = User.update(
			{ ...parsed },
			{
				where: {
					id,
				},
			},
		);
		res.send(user);
	} catch (error) {
		res.status(500).send();
	}
});

module.exports = router;
