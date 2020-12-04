const Message = require('../models/message.model');
const util = require('../utils/utils');
const MessageActions = {
	CREATE_MESSAGE: 'CREATE_MESSAGE',
	GET_ALL_MESSAGES: 'GET_ALL_MESSAGES',
	GET_MESSAGE_BY_ID: 'GET_MESSAGE_BY_ID',
	REMOVE_MESSAGE: 'REMOVE_MESSAGE',
	EDIT_MESSAGE: 'EDIT_MESSAGE',
	NEW_USER_ONLINE: 'NEW_USER_ONLINE',
	USER_ARE_DISCONNECT: 'USER_ARE_DISCONNECT',
	CHANGE_WS_STATUS: 'CHANGE_WS_STATUS',
	WS_CONNECTED: 'WS_CONNECTED',
	WS_DISCONNECT: 'WS_DISCONNECT',
	WS_CLOSED: 'WS_CLOSED',
	TYPING: 'TYPING'
};
const activeUsers = {};
 Message.sync( );
const getAllMessages = async (ws, m, server) => {
	const access = util.checkToken(`Bearer ${m.token}`);
	if (!access) {
		const messages = [{text_content: 'Unauthorized - 401'}];
		ws.send(
			JSON.stringify({
				messages,
				activeUsers: activeUsers,
				type: MessageActions.GET_ALL_MESSAGES,
			}),
		);
		return;
	}
	const messages = await
		Message.findAll({
			where: {
				removed: false,
			},
		});
	msg = JSON.stringify({
		messages,
		activeUsers: activeUsers,
		type: MessageActions.GET_ALL_MESSAGES,
	});
	Array.from(server.clients)
		.filter((o) => o.readyState === 1)
		.forEach((o) => o.send(msg));
};
const editMessage = async (ws, message, server) => {
	try {
		const { id, text_content } = message;
		await Message.update(
			{ text_content },
			{
				where: {
					id,
				},
			},
		);
		const msg = JSON.stringify({ type: MessageActions.EDIT_MESSAGE, message });
		Array.from(server.clients)
			.filter((o) => o.readyState === 1)
			.forEach((o) => o.send(msg));
	} catch (error) {}
};
const removeMessage = async (ws, message, server) => {
	try {
		const { id } = message;
		if (!id) {
			ws.send(
				JSON.stringify({
					message: 'invalid.id',
				}),
			);
			return;
		}
		await Message.update(
			{ removed: true },
			{
				where: {
					id,
				},
			},
		);

		const msg = JSON.stringify({
			type: MessageActions.REMOVE_MESSAGE,
			id,
			activeUsers: activeUsers,
		});
		Array.from(server.clients)
			.filter((o) => o.readyState === 1)
			.forEach((o) => o.send(msg));
	} catch (error) {
		console.warn('error');
	}
};
const getMessageById = async (ws, message) => {
	try {
	} catch (error) {}
};
const createMessage = async (ws, message, server) => {
	const token = util.getUserByToken(message.token);
	if (!token) {
		return;
	}
	if (!message.text_content) {
		ws.send(JSON.stringify({ ...message }));
		return;
	}
	let messageToSent = {
		text_content: message.text_content,
		message_id: message.id,
		owner_fullname: `${token.first_name} ${token.last_name}`,
		replied_to_text: message.replied_to_text,
		replied_to_id: message.replied_to_id,
		removed: false,
	};
	const newMess = new Message({
		...messageToSent,
	});
	await newMess.save();

	const msg = JSON.stringify({
		type: MessageActions.CREATE_MESSAGE,
		message: { ...messageToSent },
		activeUsers: Object.values(activeUsers),
	});
	Array.from(server.clients)
		.filter((o) => o.readyState === 1)
		.forEach((o) => o.send(msg));
};
const Socket = async (ws, req, server) => {
	let key = req;
	ws.on('message', async (data) => {
		try {
			const message = JSON.parse(data);
			switch (message.type) {
				case MessageActions.CREATE_MESSAGE:
					await createMessage(ws, message, server);
					return;
				case MessageActions.GET_ALL_MESSAGES:
					await getAllMessages(ws, message, server);
					return;
				case MessageActions.GET_MESSAGE_BY_ID:
					await getMessageById(ws, message, server);
					return;
				case MessageActions.REMOVE_MESSAGE:
					await removeMessage(ws, message, server);
					return;
				case MessageActions.EDIT_MESSAGE:
					await editMessage(ws, message, server);
					return;
				case MessageActions.USER_ARE_DISCONNECT:
					disconnectUser(ws, key, server);
					return;
				case MessageActions.NEW_USER_ONLINE: {
					const user = util.getUserByToken(message.token);
					key = user.first_name;
					connectUser(ws, message.token, key, server);
					return;
				}
				case MessageActions.TYPING: {
					const user = util.getUserByToken(message.token);

					sendTyping(ws, message.token, user, server)
					return
				}
				default:
					return;
			}
		} catch (error) {
			console.warn(error);
			return;
		}
	});

	ws.on('close', () => {
		disconnectUser(ws, key, server);

	});
};

function sendTyping(ws, token, user, server) {
	const msg = JSON.stringify({
		type: MessageActions.TYPING,
		user
	});
	Array.from(server.clients)
		.filter((o) => o.readyState === 1)
		.forEach((o) => o.send(msg));
}

function connectUser(ws, token, key, server) {
	const user = util.getUserByToken(token);
	activeUsers[key] = JSON.stringify(user);
	const msg = JSON.stringify({
		type: MessageActions.NEW_USER_ONLINE,
		activeUsers: Object.values(activeUsers),
	});
	Array.from(server.clients)
		.filter((o) => o.readyState === 1)
		.forEach((o) => o.send(msg));

	console.warn('CONNECTED: -> ', key);
}

function disconnectUser(ws, key, server) {
	const msg = JSON.stringify({
		type: MessageActions.USER_ARE_DISCONNECT,
		user: activeUsers[key],
	});
	Array.from(server.clients)
		.filter((o) => o.readyState === 1)
		.forEach((o) => o.send(msg));
	delete activeUsers[key];
	console.warn('DISCONNECTED: -> ', key);
}
module.exports = Socket;

