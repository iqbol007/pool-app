const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const server = express();
const ws = require('ws');
const path = require('path');
const httpServer = server.listen(process.env.PORT || 9999);
const wsServer = new ws.Server({ server: httpServer });
const publicPath = path.resolve(__dirname, 'uploads');
server.use(express.json());
server.use('/static', express.static(publicPath));
server.use(cors());
server.use(fileUpload({createParentPath: true}));
server.use(bodyParser.json());
server.use('/api/posts', require('./src/routes/post.routes'));
server.use('/api/users', require('./src/routes/user.routes'));
server.use('/api/comments', require('./src/routes/comments.routes'));
server.use('/api', require('./src/routes/template.routes'));
wsServer.on('connection', (ws, req) => {
	return require('./src/routes/messages.routes')(ws, req, wsServer);
});
// server.use(bodyParser.urlencoded({ extended: true }));
// server.use(morgan('dev'));
const www = 2;
function f(a) {
	a++
	return  {
		increment:()=>a++,decrement:()=>a++
	}
}

console.log(f(www).decrement())
