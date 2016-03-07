const ownsClientApp = function (clientAppId, ownerId) {
    const client = Client.findOne(clientAppId);
    return client && client.ownerId === ownerId;
};

const isBanned = function (clientAppId, clientIp) {
    return Banned.find({clientAppId: clientAppId, clientIp: clientIp}).count();
};

Meteor.publish('Chat.messagesList', function (clientAppId, userSessionId) {
    check(clientAppId, String);
    check(userSessionId, Match.Optional(String));
    // the part for service admins
    if (this.userId && ownsClientApp(clientAppId, this.userId)) {
        return Chat.find({clientAppId: clientAppId}, {sort: {date: 1}});
    }
    // here we have publication for client apps
    if (userSessionId && !isBanned(clientAppId, this.connection.clientAddress)) {
        check(userSessionId, String);
        return Chat.find({clientAppId: clientAppId, userSessionId: userSessionId}, {sort: {date: 1}});
    }
    return this.ready();
});

Meteor.publish('Client.appsList', function () {
    // client apps list
    if (this.userId) {
        return Client.find({ownerId: this.userId});
    }
    return this.ready();
});

Meteor.publish('Client.appView', function (clientAppId) {
    check(clientAppId, String);
    // single client app view
    if (this.userId) {
        return Client.find({_id: clientAppId, ownerId: this.userId});
    }
    return this.ready();
});

Meteor.publish('Banned.ipList', function (clientAppId) {
    check(clientAppId, String);
    if (this.userId && ownsClientApp(clientAppId, this.userId)) {
        return Banned.find({clientAppId: clientAppId});
    }
    return this.ready();
});

Meteor.publish('Meteor.users.emailNotifications', function () {
    if (this.userId) {
        return Meteor.users.find({_id: this.userId}, {fields: {emailNotifications: 1}});
    }
    return this.ready();
});