Template.removeChatsModal.events({
    'click .js-remove-chat-messages'(e) {
        e.preventDefault();
        const tmpl = Template.instance();
        const data = Template.currentData();
        const userSessionId = data && data.userSessionId;
        const clientIp = data && data.clientIp;
        const clientAppId = FlowRouter.getParam('clientAppId');
        if (tmpl.$('#remove-chat-by-id').is(':checked')) {
            Meteor.call('removeChatMessages', clientAppId, userSessionId, 'sessionId', function (err) {
                if (!err) {
                    sAlert.success('All messages with Session Id: ' + userSessionId + ' are removed.', {offset: 50});
                }
            });
        }
        if (tmpl.$('#remove-chat-by-ip').is(':checked')) {
            Meteor.call('removeChatMessages', clientAppId, clientIp, 'clientIp', function (err) {
                if (!err) {
                    sAlert.success('All messages sent from IP: ' + clientIp + ' are removed.', {offset: 50});
                }
            });
        }
        sChatModal.close();
    }
});