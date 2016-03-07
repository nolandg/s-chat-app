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