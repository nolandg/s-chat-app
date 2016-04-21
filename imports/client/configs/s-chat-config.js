import { Meteor } from 'meteor/meteor';
import { sChat } from 'meteor/schat:client-core';

// if you want to host your own instance of SimpleChat.Support
// you need to change these settings
Meteor.startup(function () {
    sChat.init('vkY7LM7w9YmtGpsGe', {
        ssl: true,
        welcomeMessage: 'Hello, this is just a demo chat box, I\'m almost always offline ;) But if you have any questions, you can leave the message with your e-mail. Just send it as a message. I\'ll read it later and get back to you. There will be some improvements regarding this functionality soon!',
        hostName: 'www.simplechat.support',
        labels: {
            sendPlaceholder: 'Send the message... (Enter to send)',
            headerTitle: 'SimpleChat.Support Demo!'
        }
    });
});