import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { sChatModal } from '../../configs/modal.js';

import './remove-account-modal.html';

Template.removeAccountModal.events({
    'click .js-remove-account'(e) {
        e.preventDefault();
        Meteor.call('removeUserAccount', (err) => {
            if (!err) {
                sChatModal.close();
                Meteor.setTimeout(() => {
                    sAlert.success('Your account was removed.');
                }, 0);
            }
        });
    }
});