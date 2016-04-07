import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { sChatModal } from '../../configs/modal.js';

import './ban-user-ip-modal.html';

Template.banUserIpModal.events({
    'click .js-ban-user-ip'(e) {
        e.preventDefault();
        const tmpl = Template.instance();
        const data = Template.currentData();
        const clientIp = data && data.clientIp;
        const clientAppId = FlowRouter.getParam('clientAppId');
        if (clientIp && clientAppId) {
            Meteor.call('banUserIp', clientAppId, clientIp, function (err) {
                if (!err) {
                    sAlert.success('The IP: ' + clientIp + ' is now banned. You can remove the banned IP. Click the flag icon.', {offset: 50, timeout: 7000});
                }
            });
        }
        sChatModal.close();
    }
});