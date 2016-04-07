import './modal.html';

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { sChatModal } from '../../configs/modal.js';

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