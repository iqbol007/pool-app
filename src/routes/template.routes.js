const { Router } = require('express');
const router = Router();
const User = require('../database/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const checkToken = require('../utils/utils');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const ws = require('ws');
const TYPE_IMAGE = 'IMAGE';
const TYPE_AUDIO = 'AUDIO';
const TYPE_VIDEO = 'VIDEO';

router.get('/', (req, res) => res.json({ message: 'Hello World' }));
router.post('/media', async (req, res) => {
	console.log(req.files, req.file);
	try {
		if (!req.files) {
			res.send({
				status: false,
				message: 'No file uploaded',
			});
		} else {
			let avatar = req.files.avatar;
			avatar.mv('./uploads/' + avatar.name);
			res.send({
				status: true,
				message: 'File is uploaded',
				data: {
					name: avatar.name,
					mimetype: avatar.mimetype,
					size: avatar.size,
				},
			});
		}
	} catch (err) {
		res.status(500).send(err);
	}
});

module.exports = router;
