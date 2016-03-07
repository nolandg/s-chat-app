Template.clientAppList.onCreated(function () {
    this.subscribe('Client.appsList');
});

Template.clientAppList.helpers({
    clients() {
        const userId = Meteor.userId();
        if (userId) {
            return Client.find({ownerId: userId});
        }
    },
    canAddMore() {
        const userId = Meteor.userId();
        if (userId) {
            const clients = Client.find({ownerId: userId});
            const appsLimit = Meteor.settings.public.maxClientApps || 3;
            return clients.count() < appsLimit;
        }
    }
});

Template.clientAppList.events({
    'click .js-submit-new-client'() {
        const tmpl = Template.instance();
        const name = tmpl.$('#client-input').val();
        if (name) {
            Meteor.call('addClientApp', name, () => {
                tmpl.$('#client-input').val('')
            });
        }
    },
    'keydown .js-submit-new-client-input'(e) {
        const key = e.keyCode || e.which;
        const tmpl = Template.instance();
        const name = $(e.currentTarget).val();
        if (key === 13 && name) {
            e.preventDefault();
            Meteor.call('addClientApp', name, () => {
                tmpl.$('#client-input').val('')
            });
        }
    },
    'click .js-app-list-info'() {
        sChatModal.open('appListHelpModal');
    },
    'click .js-report-bug'() {
        sChatModal.open('reportBugModal');
    },
    'click .js-email-notifications'() {
        sChatModal.open('emailNotificationsModal');
    }
});

Template.clientItem.events({
    'click .js-remove-client-app'() {
        sChatModal.open('removeAppModal', {clientAppId: this._id});
    }
});