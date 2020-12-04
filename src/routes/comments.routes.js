const { Router } = require('express');
const router = Router();
const Comment = require('../models/comment.model');
const checkToken = require('../utils/utils');
/*GET ALL COMMENTS*/
router.get('/getAll', (req, res) => {
	try {
		const isValidToken = checkToken(req.headers.authorization);
		if (!isValidToken) {
			res.status(401).send({ message: 'Token expiried' });
		}
	} catch (error) {
		res.status(500).send({ message: 'Internal server error' });
	}
});
Comment.sync();
/*CREATE NEW COMMENT*/
router.post('/createComment', async (req, res) => {
	try {
		// const isValidToken = checkToken(req.headers.authorization);
		// if (!isValidToken) {
		// 	res.status(401).send({ message: 'Token expiried' });
		// }

		const comment = new Comment({
			text_content: '',
			comment_id: '',
			owner_id: '',
			replied_to_text: '',
			replied_to_id: '',
		});
		await comment.save();
		res.send({ comment });
	} catch (error) {
		res.status(500).send({ message: 'Internal server error' });
	}
});
/*UPDATE EXISTENT COMMENT*/
router.put('/updateComment', (req, res) => {
	try {
		const isValidToken = checkToken(req.headers.authorization);
		if (!isValidToken) {
			res.status(401).send({ message: 'Token expiried' });
		}
	} catch (error) {
		res.status(500).send({ message: 'Internal server error' });
	}
});
/*REMOVE COMMENT*/
router.delete('/deleteComment', (req, res) => {
	try {
		const isValidToken = checkToken(req.headers.authorization);
		if (!isValidToken) {
			res.status(401).send({ message: 'Token expiried' });
		}
	} catch (error) {
		res.status(500).send({ message: 'Internal server error' });
	}
});
module.exports = router;
