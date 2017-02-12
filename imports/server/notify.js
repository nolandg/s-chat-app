import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { Chat } from '../both/collections/collections.js';
import Fiber from 'fibers';

const settings = Meteor.settings.private.fbMessenger;

const http = require('http');
const Bot = require('messenger-bot');

WebApp.connectHandlers.use('/x', (req, res) => {
  console.log('Processing webhook verification from Facebook...');
  console.log('Token: ', req.query['hub.verify_token']);
  console.log('Challenge: ', req.query['hub.challenge']);
  res.writeHead(200);
  if (req.query['hub.verify_token'] === 'peachypaws') {
    res.end(req.query['hub.challenge']);
  } else {
    res.end('Not peachy. Sorry.');
  }
});

const bot = new Bot({
  token: settings.pageAccessToken,
  verify: settings.verifyToken,
  app_secret: settings.appSecret,
});

bot.on('error', (err) => {
  console.log(err.message);
});

function sendMessage(recipientId, text) {
  const message = {
    text,
  };

  bot.sendMessage(recipientId, message, (error, info) => {
    if (error) {
      console.error(error);
      return;
    }

    console.log(info);
  });
}

function notifyAdmin(data) {
  const trucatedSession = data.userSessionId.substr(0, 3) + '...' + data.userSessionId.substr(-3, 3);
  const text = `[${trucatedSession}]\r\n\r\n${data.msg}`;

  settings.idsToNotify.forEach((id) => {
    sendMessage(id, text);
  });
}

bot.on('message', (payload) => {
  Fiber(() => {
    const lastMessage = Chat.findOne({}, { sort: { date: 1 } });
	console.log('Last Message: ', lastMessage);
    const data = {
      msg: payload.message.text,
      clientAppId: lastMessage.clientAppId,
      userSessionId: lastMessage.userSessionId,
      date: new Date(),
      isFromClient: false,
      clientIp: '0.0.0.0',
    };

    Chat.insert(data);
  }).run();
});

http.createServer(bot.middleware()).listen(7034);
export { notifyAdmin };
