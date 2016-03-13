// if you want to host your own instance of SimpleChat.Support
// you need to change these settings
Meteor.startup(function () {
    sChat.init('vkY7LM7w9YmtGpsGe', {
        ssl: true,
        welcomeMessage: 'Hi, this is the demo chat box! You can have the same in your app! Do you have any questions?',
        hostName: 'www.simplechat.support',
        labels: {
            sendPlaceholder: 'Send the message... (press Enter to send)',
            headerTitle: 'SimpleChat.Support Demo!'
        }
    });
});