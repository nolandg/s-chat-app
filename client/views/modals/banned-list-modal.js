const isProperIP = function (ip) {
    return /(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])/.test(ip);
};

const isNotInDatabase = function (clientAppId, clientIp) {
    return !Banned.find({clientAppId: clientAppId, clientIp: clientIp}).count();
};

Template.bannedListModal.helpers({
    bannedIps() {
        const data = Template.currentData();
        const clientAppId = data && data.clientAppId;
        return Banned.find({clientAppId: clientAppId});
    }
});

Template.bannedListModal.events({
    'keyup .js-ban-ip-input'(e) {
        // we want to block letters in IP input
        const checkKey = (e.keyCode === 46 || e.keyCode === 8 || e.keyCode === 190 || e.keyCode === 110 || (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105));
        if (!checkKey) {
            $(e.currentTarget).val('');
        };
    },
    'click .js-ban-ip'(e) {
        e.preventDefault();
        const tmpl = Template.instance();
        const data = Template.currentData();
        const ipVal = tmpl && tmpl.$('.js-ban-ip-input').val();
        if (ipVal && isProperIP(ipVal) && isNotInDatabase(data.clientAppId, ipVal)) {
            Meteor.call('banUserIp', data.clientAppId, ipVal);
        } else {
            sAlert.error('IP should be valid and should not be present in the database.', {offset: 50});
        }
        tmpl.$('.js-ban-ip-input').val('');
    },
    'click .js-remove-ban'(e) {
        e.preventDefault();
        const data = Template.currentData();
        const currentIP = this.clientIp;
        if (data && data.clientAppId && currentIP) {
            Meteor.call('removeBannedUserIp', data.clientAppId, currentIP);
        }
    }
});