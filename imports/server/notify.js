import { Meteor } from 'meteor/meteor';
import fiber from 'fibers';
import http from 'http';
import Bot from 'messenger-bot';
import { Chat } from '../both/collections/collections.js';

const settings = Meteor.settings.private.fbMessenger;

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

  console.log('Sending message to: ', recipientId);
  bot.sendMessage(recipientId, message, (error) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log('Sent message to: ', recipientId);
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
  console.log('Received message: ', payload);
  fiber(() => {
    const lastMessage = Chat.findOne({ isFromClient: true }, { sort: { date: -1 } });
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
