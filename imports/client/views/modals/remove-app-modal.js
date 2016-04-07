import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { sChatModal } from '../../configs/modal.js';

import './remove-app-modal.html';

Template.removeAppModal.events({
    'click .js-remove-client-app'(e) {
        e.preventDefault();
        const data = Template.currentData();
        if (data && data.clientAppId) {
            Meteor.call('removeClientApp', data.clientAppId, function (err) {
                if (!err) {
                    sAlert.success('Client app was removed', {offset: 50});
                }
            });
            sChatModal.close();
        }

    }
});