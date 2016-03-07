// accounts templates info
Accounts.emailTemplates.siteName = Meteor.settings.public.hostName || 'SimpleChat.Support';
Accounts.emailTemplates.from = (Meteor.settings.public.hostName || 'SimpleChat.Support') + ' Admin <' + Meteor.settings.private.mainAppEmail + '>';

// mailgun config
Meteor.startup(function () {
    process.env.MAIL_URL = Meteor.settings.private.mailGun;
});

// social login account creation... see more docs here: http://s-id.meteor.com
// here only for Google and Facebook
// we want to create proper 'username' field based on the data from Google or Facebook
Accounts.onCreateUser(function (options, user) {
    if (user.services.google) {
        user.username = user.services.google.name || user.services.google.email;
        user.emails = [];
        user.emails.push({
            address: user.services.google.email,
            verified: true
        });
        return user;
    }
    if (user.services.facebook) {
        user.username = user.services.facebook.name || user.services.facebook.email;
        user.emails = [];
        user.emails.push({
            address: user.services.facebook.email,
            verified: true
        });
        return user;
    }
    return user;
});