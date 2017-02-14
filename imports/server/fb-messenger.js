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

function shortenUserSessionId(id) {
  return '<' + id.substr(0, 3) + '...' + id.substr(-3, 3) + '>';
}

function notifyAdmins(data) {
  const sessionId = shortenUserSessionId(data.userSessionId);
  const from = data.isFromClient ? 'Customer writes:' : 'Support writes';
  const text = `${sessionId}\r\n${from}\r\n\r\n${data.msg}`;

  const client = Client.findOne(data.clientAppId);
  const admins = FbAdmins.find({ ownerId: client.ownerId }).fetch();

  admins.forEach((admin) => {
    sendMessage(admin.contactId, text);
  });
}

// Handles and returns true for any control messages
function handleControlMessage(text, fbAdmin) {
  const lowerCaseText = text.toLowerCase();
  if (lowerCaseText.indexOf('pawson') !== -1) {
    // This is a control message putting the admin online
    FbAdmins.update(fbAdmin._id, { '$set': { online: true } });
    return true;
  } else if (lowerCaseText.indexOf('pawsoff') !== -1) {
    // This is a control message putting the admin online
    FbAdmins.update(fbAdmin._id, { '$set': { online: false } });
    return true;
  }

  return false;
}

function getLastMessageFromClient(clientAppIds) {
  return Chat.findOne({ isFromClient: true, clientAppId: { $in: clientAppIds } }, { sort: { date: -1 } });
}

function attachMessageToLastChat(text, clientAppIds) {
  const lastMessage = getLastMessageFromClient(clientAppIds);
  if (!lastMessage) return;

  const data = {
    msg: text,
    clientAppId: lastMessage.clientAppId,
    userSessionId: lastMessage.userSessionId,
    date: new Date(),
    isFromClient: false,
    clientIp: '0.0.0.0',
  };

  Chat.insert(data);
}

function sendMessageToOtherAdmins(fbAdmin, owner, text, clientAppIds) {
  const lastMessage = getLastMessageFromClient(clientAppIds);
  const otherFbAdmins = FbAdmins.find({ ownerId: owner._id, _id: { $not: fbAdmin._id } }).fetch();
  const sessionId = shortenUserSessionId(lastMessage.userSessionId);

  otherFbAdmins.forEach((admin) => {
    const messageText = `${sessionId}\r\n${admin.name} writes:\r\n\r\n${text}`;
    sendMessage(admin.contactId, messageText);
  });
}

bot.on('message', (payload) => {
  console.log('Received Facebook message from contact ID: ', payload.sender.id);

  fiber(() => {
    const fbAdmin = FbAdmins.findOne({ contactId: payload.sender.id });
    const owner = Meteor.users.findOne(fbAdmin.ownerId);
    const clientAppIds = Client.find({ ownerId: owner._id }).fetch();
    const text = payload.message.text;

    if (!fbAdmin) {
      // Received a message from a contact ID that's not registered so ignore it
      return;
    }

    if (handleControlMessage(text, fbAdmin)) {
      // Don't do anything else with control messages
      return;
    }

    if (!fbAdmin.online) {
      // update admin online status, they must be online if sending a message
      FbAdmins.update(fbAdmin._id, { $set: { online: true } });
    }

    attachMessageToLastChat(text, clientAppIds);

    sendMessageToOtherAdmins(fbAdmin, owner, text, clientAppIds);
  }).run();
});

http.createServer(bot.middleware()).listen(7034);
export { notifyAdmins };
