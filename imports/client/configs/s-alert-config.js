import { Meteor } from 'meteor/meteor';
import { sAlert } from 'meteor/juliancwirko:s-alert';

Meteor.startup(function () {
    sAlert.config({
        position: 'bottom-right',
        effect: 'slide'
    });
});