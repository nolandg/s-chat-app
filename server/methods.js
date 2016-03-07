// check if client app with this particular clientAppId exists in the database
const clientExists = function (clientAppId) {
    const client = Client.find(clientAppId);
    return client.count();
};

// check if admin user reached client apps limit (from settings.json)
const isNotClientLimit = function (ownerId) {
    const clients = Client.find({ownerId: ownerId});
    const appsLimit = Meteor.settings.public.maxClientApps || 3;
    return clients.count() < appsLimit;
};

// check if admin user is an owner of the app
const ownsClientApp = function (clientAppId, ownerId) {
    const client = Client.findOne(clientAppId);
    return client && client.ownerId === ownerId;
};

// check if user's IP is banned
const isBanned = function (clientAppId, clientIp) {
    return Banned.find({clientAppId: clientAppId, clientIp: clientIp}).count();
};

const isProperIP = function (clientIp) {
    return /(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])/.test(clientIp);
};

// we need this one to check if there is a new chat session
// we will use it for e-mail notifications
const isUserSessionIdNew = function (userSessionId) {
    const chatMsgCurr = Chat.find({userSessionId: userSessionId});
    return chatMsgCurr.count() === 1;
};

// Meteor methods declarations starts here:
Meteor.methods({
    // add new message - available also for client apps

    addChatMessage(msg, clientAppId, userSessionId, isFromClient) {
        check(msg, String);
        check(clientAppId, String);
        check(userSessionId, String);
        check(isFromClient, Match.Optional(Boolean));
        isFromClient = isFromClient || false;

        if (!clientExists(clientAppId)) {
            return;
        }

        if (isBanned(clientAppId, this.connection.clientAddress)) {
            throw new Meteor.Error(403, 'Error 403: Your IP has been banned!');
        }

        Chat.insert({
            msg: msg,
            clientAppId: clientAppId,
            userSessionId: userSessionId,
            date: new Date(),
            isFromClient: isFromClient,
            clientIp: this.connection.clientAddress
        });

        this.unblock();

        // check and send e-mail notification if needed
        if (clientAppId && isUserSessionIdNew(userSessionId)) {
            const client = Client.findOne({_id: clientAppId});
            const ownerId = client && client.ownerId;
            const owner = Meteor.users.findOne({_id: ownerId});
            const ownerEmail = owner.emails[0].address;
            const ownerWantsNotifications = owner.emailNotifications;
            const hostName = Meteor.settings.public.hostName || 'SimpleChat.Support';
            const appEmail = Meteor.settings.private.mainAppEmail;
            if (ownerWantsNotifications && ownerEmail && client.name && owner.username) {
                // email templates needed...
                Email.send({
                    to: ownerEmail,
                    from: `${hostName} <${appEmail}>`,
                    subject: `${hostName} reminder - New chat session!`,
                    html: `
                        <h2>Hello ${owner.username}! </h2>
                        There is a new chat session waiting for response in client app: <strong>${client.name}</strong>. <br><br>
                        <strong>Message:</strong><br>
                        ${msg}<br><br>
                        Replay in the app: <a href="http://${hostName}/client/${clientAppId}">${hostName}/client/${clientAppId}</a><br><br><hr>
                        <small>You can disable notifications in your admin panel.</small>
                    `
                });
            }
        }
    },
    // add client app - available for logged in operators/admins
    addClientApp(name) {
        check(name, String);
        if (this.userId && isNotClientLimit(this.userId)) {
            Client.insert({name: name, ownerId: this.userId});
        }
    },
    // remove client app - available for logged in operators/admins
    removeClientApp(clientAppId) {
        check(clientAppId, String);
        if (this.userId && ownsClientApp(clientAppId, this.userId)) {
            Chat.remove({clientAppId: clientAppId});
            Client.remove({_id: clientAppId});
        }
    },
    // remove chat messages by clientIp or userSessionId
    removeChatMessages(clientAppId, selector, type) {
        check(clientAppId, String);
        check(selector, String);
        check(type, String);
        if (!this.userId || !ownsClientApp(clientAppId, this.userId)) {
            return;
        }
        if (type === 'clientIp') {
            const chatCurr = Chat.find({clientAppId: clientAppId, clientIp: selector}, {fields: {userSessionId: 1}}).fetch();
            chatCurr.forEach((msg) => {
                Chat.remove({clientAppId: clientAppId, userSessionId: msg.userSessionId});
            });
        }
        if (type === 'sessionId') {
            Chat.remove({clientAppId: clientAppId, userSessionId: selector});
        }
    },
    // add user ip to ban list
    banUserIp(clientAppId, clientIp) {
        check(clientAppId, String);
        check(clientIp, String);
        if (!this.userId || !ownsClientApp(clientAppId, this.userId)) {
            return;
        }
        if (isProperIP(clientIp)) {
            Banned.insert({
                clientAppId: clientAppId,
                clientIp: clientIp
            });
        }
    },
    removeBannedUserIp(clientAppId, clientIp) {
        check(clientAppId, String);
        check(clientIp, String);
        if (!this.userId || !ownsClientApp(clientAppId, this.userId)) {
            return;
        }
        if (isProperIP(clientIp)) {
            Banned.remove({
                clientAppId: clientAppId,
                clientIp: clientIp
            });
        }
    },
    updateEmailNotifications() {
        if (this.userId) {
            const userObj = Meteor.users.findOne({_id: this.userId});
            const emailNotificationsStatus = userObj.emailNotifications;
            Meteor.users.update({_id: this.userId}, {$set: {emailNotifications: !emailNotificationsStatus}});
        }
    },
    // user removes account
    // we remove all related Clients and Chats
    removeUserAccount() {
        if (this.userId) {
            const clientApps = Client.find({ownerId: this.userId});
            const clientAppsIds = clientApps.map(c => {
                return c._id;
            });
            Chat.remove({clientAppId: {$in: clientAppsIds}});
            Client.remove({ownerId: this.userId});
            Meteor.users.remove({_id: this.userId});
        }
    }
});