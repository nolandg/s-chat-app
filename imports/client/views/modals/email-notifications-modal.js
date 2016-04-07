import { Meteor } from 'meteor/meteor';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { sChatModal } from '../../configs/modal.js';

import './email-notifications-modal.html';

Template.emailNotificationsModal.events({
    'click .js-toggle-email-notifications'(e) {
        e.preventDefault();
        Meteor.call('updateEmailNotifications', (err, res) => {
            if (!err) {
                sAlert.success('E-mail notification status changed!', {offset: 50});
                sChatModal.close();
            }
        });
    }
});

Template.emailNotificationsModal.helpers({
    emailNotificationsEnabled() {
        const currentUser = Meteor.user();
        return currentUser && currentUser.emailNotifications;
    }
});