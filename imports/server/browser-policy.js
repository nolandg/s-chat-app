import { Meteor } from 'meteor/meteor';

Meteor.startup(function () {
    // browser policy rules for fontAwesome and google fonts
    // read more here: https://atmospherejs.com/meteor/browser-policy
    BrowserPolicy.content.allowOriginForAll('*.bootstrapcdn.com');
    BrowserPolicy.content.allowOriginForAll('*.googleapis.com');
    BrowserPolicy.content.allowOriginForAll('*.gstatic.com');
    BrowserPolicy.content.allowOriginForAll('*.google-analytics.com');
});
