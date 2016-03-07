sChatModal = {
    active: new ReactiveVar(false),
    template: new ReactiveVar(''),
    data: new ReactiveVar(null),
    open(template, data) {
        sChatModal.template.set(template);
        if (data) {
            sChatModal.data.set(data);
        }
        $('html').css('overflow', 'hidden');
        sChatModal.active.set(true);
    },
    close(e) {
        $('html').css('overflow', 'auto');
        sChatModal.active.set(false);
        sChatModal.template.set('');
        sChatModal.data.set(null);
    }
};

Template.modal.helpers({
    modalTemplate() {
        return sChatModal.template.get();
    },
    modalData() {
        return sChatModal.data.get();
    }
});

Template.modal.events({
    'click .js-close-modal'(e) {
        e.preventDefault();
        sChatModal.close();
    }
});

Template.modal.onDestroyed(function () {
    sChatModal.close();
});