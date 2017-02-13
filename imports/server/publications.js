import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Chat, Client, Banned, FbAdmins } from '../both/collections/collections.js';

const ownsClientApp = function (clientAppId, ownerId) {
  const client = Client.findOne(clientAppId);
  return client && client.ownerId === ownerId;
};

const isBanned = function (clientAppId, clientIp) {
  return Banned.find({ clientAppId, clientIp }).count();
};

Meteor.publish('FbAdmins', function () {
  if (this.userId) {
    return FbAdmins.find({ ownerId: this.userId }, { fields: { name: 1, contactId: 1, online: 1 } });
  }
  return this.ready();
});

Meteor.publish('Chat.messagesList', function (clientAppId, userSessionId) {
  check(clientAppId, String);
  check(userSessionId, Match.Optional(String));
    // the part for service admins
  if (this.userId && ownsClientApp(clientAppId, this.userId)) {
    return Chat.find({ clientAppId }, { sort: { date: 1 } });
  }
    // here we have publication for client apps
  if (userSessionId && !isBanned(clientAppId, this.connection.clientAddress)) {
    check(userSessionId, String);
    return Chat.find({ clientAppId, userSessionId }, { sort: { date: 1 } });
  }
  return this.ready();
});

Meteor.publish('Client.appsList', function () {
    // client apps list
  if (this.userId) {
    return Client.find({ ownerId: this.userId });
  }
  return this.ready();
});

Meteor.publish('Client.appView', function (clientAppId) {
  check(clientAppId, String);
    // single client app view
  if (this.userId) {
    return Client.find({ _id: clientAppId, ownerId: this.userId });
  }
  return this.ready();
});

Meteor.publish('Banned.ipList', function (clientAppId) {
  check(clientAppId, String);
  if (this.userId && ownsClientApp(clientAppId, this.userId)) {
    return Banned.find({ clientAppId });
  }
  return this.ready();
});

Meteor.publish('Meteor.users.emailNotifications', function () {
  if (this.userId) {
    return Meteor.users.find({ _id: this.userId }, { fields: { emailNotifications: 1 } });
  }
  return this.ready();
});

Meteor.publish('Meteor.users.adminStatus', function (clientAppId) {
  check(clientAppId, String);
  const client = Client.findOne(clientAppId);
  const adminId = client && client.ownerId;
  if (adminId) {
    return Meteor.users.find({ _id: adminId }, { fields: {
      'status.idle': 1,
      'status.online': 1,
      'status.lastLogin.date': 1,
    } });
  }
  return this.ready();
});
