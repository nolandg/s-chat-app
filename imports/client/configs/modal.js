import { ReactiveVar } from 'meteor/reactive-var';
import { $ } from 'meteor/jquery';

export const sChatModal = {
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