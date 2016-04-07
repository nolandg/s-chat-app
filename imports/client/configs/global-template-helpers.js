import { Template } from 'meteor/templating';
import { App } from './app-configs.js';
import { $ } from 'meteor/jquery';

Template.registerHelper('isSidebarClosed', function () {
    return App.sidebarClosed.get();
});

Template.registerHelper('docsContent', function () {
    $('.client-app-content.docs').scrollTop(0);
    return App.docsContentTmpl.get();
});
