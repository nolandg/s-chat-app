import { Meteor } from 'meteor/meteor';
import fiber from 'fibers';
import http from 'http';
import Bot from 'messenger-bot';
import { Client, Chat, FbAdmins } from '../both/collections/collections.js';

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

function notifyAdmins(data) {
  const trucatedSession = data.userSessionId.substr(0, 3) + '...' + data.userSessionId.substr(-3, 3);
  const text = `[${trucatedSession}]\r\n\r\n${data.msg}`;

  const client = Client.findOne(data.clientAppId);
  const admins = FbAdmins.find({ ownerId: client.ownerId }).fetch();

  admins.forEach((admin) => {
    sendMessage(admin.contactId, text);
  });
}

bot.on('message', (payload) => {
  console.log('Received Facebook message from contact ID: ', payload.sender.id);

  fiber(() => {
    const admin = FbAdmins.findOne({ contactId: payload.sender.id });
    if(!admin){
	  // Received a message from a contact ID that's not registered so ignore it
	  return;
	}

	const lowerCaseText = payload.message.text.toLowerCase();
    if (lowerCaseText.indexOf('pawson') !== -1) {
      // This is a control message putting the admin online
      FbAdmins.update(admin._id, { '$set': { online: true } });
      return;
    } else if (lowerCaseText.indexOf('pawsoff') !== -1) {
      // This is a control message putting the admin online
      FbAdmins.update(admin._id, { '$set': { online: false } });
      return;
    }

    if (!admin.online) {
      console.log('Admin not online');
	  // update admin online status, they must be online if sending a message
      const result = FbAdmins.update(admin._id, { $set: { online: true } });
	  console.log('Result: ', result);
    }

	console.log('Admin: ', admin);

    const lastMessage = Chat.findOne({ isFromClient: true }, { sort: { date: -1 } });
	if(!lastMessage) return;

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
export { notifyAdmins };
