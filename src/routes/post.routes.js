const { Router } = require('express');
const router = Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const checkToken = require('../utils/utils');
const Posts = require('../models/post.model');
const util = require('../utils/utils');
 Posts.sync();
router.get('/getAll', async (req, res) => {
	const access = util.checkToken(req.headers.authorization);
	if (!access) {
		res.status(401).send({ message: 'Unauthorized bro :-(' });
		return;
	}
	try {
		const posts = await Posts.findAll({
			where: {
				removed: false,
			},
		});
		if (posts.length === 0) {
			console.log(posts.length);
			res.status(400).send({ message: 'no posts' });
			return;
		}
		res.send({ posts });
		return;
	} catch (error) {
		res.status(500).send({ message: 'Server internal error' });
	}
});
router.put('/updatePost', async (req, res) => {
	try {
		const {
			content,
			owner_id,
			media,
			media_type,
			post_id,
			removed,
			id,
		} = req.body;
		if (!id || Number.isNaN(id)) {
			res.status(400).send({ message: 'Uncorrect id bro :(' });
		}
		const params = { content, owner_id, media, media_type, post_id, removed };
		const parsed = Object.entries(params).reduce((acc, [key, value]) => {
			if (value !== undefined) {
				acc[key] = value;
				return acc;
			} else {
				return acc;
			}
		}, {});
		await Posts.update(
			{ ...parsed },
			{
				where: {
					id,
				},
			},
		);
		res.send({ message: 'Post updated successfully :)' });
	} catch (error) {
		res.send({ message: 'Internal Server Error' });
	}
});

router.post('/createPost', async (req, res) => {
	try {
		const { content, owner_id } = req.body;
		let post_media;
		if (!content || !owner_id) {
			res
				.status(400)
				.send({ message: 'Uncorrect response, check content and owner_id' });
			return;
		}
		console.log(req.files);
		if (req.files) {
			post_media = req.files.post_media;
			post_media.mv('./uploads/' + post_media.name);
		}
		console.log(req.body);
		const newPost = new Posts({
			content,
			owner_id,
			media: post_media.name,
			media_type: '',
			post_id: parseInt(Math.random() * 100000),
			removed: false,
		});
		await newPost.save();
		res.send({ post: newPost });
		return;
	} catch (error) {
		res.status(500).send({ message: 'Internal server error' });
	}
});
router.delete('/delete', async (req, res) => {
	try {
		const { id } = req.query;
		if (!id || Number.isNaN(id)) {
			res.status(400).send({ message: 'Uncorrect id bro :(' });
		}
		await Posts.update(
			{ removed: true },
			{
				where: {
					id,
				},
			},
		);
		res.send({ message: 'Post removed successfully :(', id });
	} catch (error) {
		res.status(500).send({ message: 'Internal server error' });
	}
});
router.put('/restore', async (req, res) => {
	try {
		const { id } = req.query;
		if (!id || Number.isNaN(id)) {
			res.status(400).send({ message: 'Uncorrect id bro :(' });
		}
		await Posts.update(
			{ removed: false },
			{
				where: {
					id: 1,
				},
			},
		);
		res.send({ message: 'Post restored successfully :)' });
	} catch (error) {
		res.status(500).send({ message: 'Internal server error' });
	}
});

router.post('/like', async (req, res) => {
	try {
		const { post_id, user_id } = req.body;
		if (
			!user_id ||
			Number.isNaN(user_id) ||
			!post_id ||
			Number.isNaN(post_id)
		) {
			res.status(400).send({ message: 'Uncorrect id bro :(' });
			return;
		}
		const post = await Posts.findOne({ where: { post_id } });
		if (!post) {
			res.status(404).send({ message: 'Post not found' });
			return;
		}

		const isLikedByMe =
			post.post_liked_users &&
			post.post_liked_users.find((like) => {
				return like == user_id;
			});
		// console.log(isLikedByMe);
		if (isLikedByMe) {
			const postLikedUsers =
				post.post_liked_users &&
				post.post_liked_users.filter(
					(like) => Number(like) !== Number(user_id),
				);
			/**
			 * if anyone liked this post  we update this post fields post_liked_users, post_likes
			 */
			if (postLikedUsers.length !== 0) {
				const updatedPost = {
					post_liked_users: [...postLikedUsers],
					post_likes: Number(post.post_likes) - 1,
				};
				await Posts.update({ ...updatedPost }, { where: { post_id } });
				res.send({ ...post.dataValues, ...updatedPost });
				return;
			} else {
				const updatedPost = {
					post_liked_users: null,
					post_likes: 0,
				};
				await Posts.update({ ...updatedPost }, { where: { post_id } });
				console.log(2);
				res.send({ ...post.dataValues, ...updatedPost });
				return;
			}
			/**
			 * else if no-one liked this post and post_liked_users = null we update this post_liked_users = [user_id] , post_likes = 1
			 */
		} else {
			const updatedPost = {
				post_liked_users: post.post_liked_users
					? [...post.post_liked_users, Number(user_id)]
					: [user_id],
				post_likes: Number(post.post_likes) + 1,
			};
			await Posts.update({ ...updatedPost }, { where: { post_id } });
			res.send({ ...post.dataValues, ...updatedPost });
			return;
		}
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: 'internal server error' });
	}
});
module.exports = router;
