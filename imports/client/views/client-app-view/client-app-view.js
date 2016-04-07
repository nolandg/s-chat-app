import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Chat, Client } from '../../../both/collections/collections.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { sChatModal } from '../../configs/modal.js';
import { App } from '../../configs/app-configs.js';
import '../../configs/global-template-helpers.js';

import '../spinner/spinner.html';

// modals templates
import '../modals/app-view-help-modal.html';
import '../modals/report-bug-modal.html';
import '../modals/banned-list-modal.js';
import '../modals/email-notifications-modal.js';
import '../modals/remove-chats-modal.js';
import '../modals/ban-user-ip-modal.js';

import './client-app-view.html';

const lastMessageDate = function (userSessionId) {
    const msg = Chat.findOne({userSessionId: userSessionId}, {sort: {date: -1}}, {fields: {date: 1}});
    const date = msg && msg.date && msg.date.toLocaleString();
    return date;
};

const clientIpAddress = function (userSessionId) {
    const msg = Chat.findOne({userSessionId: userSessionId, isFromClient: true}, {fields: {clientIp: 1}});
    const clientIp = msg && msg.clientIp;
    return clientIp;
};

// based on Modernizr library
const testTouchDevice = function () {
    let bool = false;
    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        bool = true;
    }
    return bool;
};

Template.clientAppView.onCreated(function () {
    const clientAppId = FlowRouter.getParam('clientAppId');
    openedChats.remove({});
    this.subscribe('Client.appView', clientAppId);
    this.subscribe('Chat.messagesList', clientAppId);
    this.subscribe('Banned.ipList', clientAppId);
    if (window.matchMedia('(max-width: 480px)').matches) {
        App.sidebarClosed.set(true);
    }
});

Template.clientAppView.helpers({
    client() {
        return Client.findOne({_id: FlowRouter.getParam('clientAppId')});
    },
    chats() {
        const chatCursor = Chat.find({clientAppId: FlowRouter.getParam('clientAppId')}, {sort: {date: -1}});
        const userSessionIdsIds = chatCursor.map((chat) => {
            return chat.userSessionId;
        });
        const uniqUserSessionIds = _.uniq(userSessionIdsIds);
        return uniqUserSessionIds;
    },
    openedChats() {
        return openedChats.find({}, {sort: {openedTime: -1}});
    }
});

Template.clientAppView.events({
    'click .js-chatbox-close-all'() {
        openedChats.remove({});
    },
    'click .js-app-view-info'() {
        sChatModal.open('appViewHelpModal');
    },
    'click .js-report-bug'() {
        sChatModal.open('reportBugModal');
    },
    'click .js-ban-list'() {
        const clientAppId = FlowRouter.getParam('clientAppId');
        if (clientAppId) {
            sChatModal.open('bannedListModal', {clientAppId: clientAppId});
        }
    },
    'click .js-toggle-sidebar'(e) {
        e.preventDefault();
        const sidebarStatus = App.sidebarClosed.get();
        App.sidebarClosed.set(!sidebarStatus);
    },
    'click .js-email-notifications'(e) {
        e.preventDefault();
        sChatModal.open('emailNotificationsModal');
    }
});

Template.chatItem.helpers({
    lastMessageDate() {
        const userSessionId = Template.currentData();
        return lastMessageDate(userSessionId);
    },
    clientIp() {
        const userSessionId = Template.currentData();
        return clientIpAddress(userSessionId);
    },
    needsReplay() {
        const userSessionId = Template.currentData();
        const message = Chat.findOne({userSessionId: userSessionId}, {sort: {date: -1}});
        const isFromClient = message && message.isFromClient;
        return isFromClient;
    },
    isOpened() {
        const userSessionId = Template.currentData();
        const chat = openedChats.findOne({userSessionId: userSessionId});
        return chat && !_.isEmpty(chat);
    },
    isTouchDevice() {
        return testTouchDevice();
    },
    soonRemoved() {
        const userSessionId = Template.currentData();
        const message = Chat.findOne({userSessionId: userSessionId}, {sort: {date: 1}});
        const messageDate = message && message.date;
        const today = new Date();
        const daysAgo = Meteor.settings.public.maxChatHistoryInDays - 1 || 2;
        const daysAgoDate = new Date(today.setDate(today.getDate() - daysAgo));
        return moment(daysAgoDate).diff(messageDate, 'days') >= 1;
    }
});

Template.chatItem.events({
    'click .js-open-chat-box'(e) {
        e.preventDefault();
        const userSessionId = Template.currentData();
        const countOpenedChats = openedChats.find().count();
        const chatIsOpened = !_.isEmpty(openedChats.findOne({userSessionId: userSessionId}));

        if (chatIsOpened) {
            $('#chat-box-' + userSessionId).find('.js-chat-submit-input').focus();
            $('.js-chat-box').removeClass('s-chat-box-matched');
            $('#chat-box-' + userSessionId).addClass('s-chat-box-matched');
            return;
        }

        openedChats.insert({userSessionId: userSessionId, openedTime: new Date()});
    },
    'click .js-open-remove-modal'() {
        const userSessionId = Template.currentData();
        if (userSessionId) {
            sChatModal.open('removeChatsModal', {clientIp: clientIpAddress(userSessionId), userSessionId: userSessionId});
        }
    },
    'click .js-ban-user-modal'() {
        const userSessionId = Template.currentData();
        if (userSessionId) {
            sChatModal.open('banUserIpModal', {clientIp: clientIpAddress(userSessionId)});
        }
    }
});

Template.chatView.onRendered(function () {
    const messages = this.$('.js-chat-messages');
    const input = this.$('.js-chat-submit-input');
    const data = Template.currentData();
    const userSessionId = data && data.userSessionId;
    // scroll messages down
    // we need to rerun it on new message
    this.autorun(() => {
        const messagesCount = Chat.find({userSessionId: userSessionId}).count();
        if (messagesCount) {
            messages[0].scrollTop = messages[0].scrollHeight;
        }
    });
    // init textarea autosize while writing
    autosize(input);
    // focus message textarea on open
    input.focus();
    // initial heights of messages container and message textarea needed for height calculations and autosize
    this.textareaInitSize = input.outerHeight();
    this.messagesInitSize = $(messages).outerHeight();
});

Template.chatView.helpers({
    messages() {
        const data = Template.currentData();
        return Chat.find({userSessionId: data.userSessionId}, {sort: {date: 1}});
    },
    lastMessageDate() {
        const data = Template.currentData();
        if (data && data.userSessionId) {
            return lastMessageDate(data.userSessionId);
        }
    },
    clientIp() {
        const data = Template.currentData();
        if (data && data.userSessionId) {
            return clientIpAddress(data.userSessionId);
        }
    }
});

Template.chatView.events({
    'keydown .js-chat-submit-input'(e) {
        const tmpl = Template.instance();
        const data = Template.currentData();
        const msg = $(e.currentTarget).val();
        const clientAppId = FlowRouter.getParam('clientAppId');
        const userSessionId = data.userSessionId;
        const key = e.keyCode || e.which;
        if (key === 13 && !e.shiftKey) {
            e.preventDefault();
            if (msg.trim() !== '') {
                Meteor.call('addChatMessage', msg, clientAppId, userSessionId);
                $(e.currentTarget).val('');
                const messages = $(e.currentTarget).closest('.js-chat-box').find('.js-chat-messages')[0];
                messages.scrollTop = messages.scrollHeight;
                $(messages).outerHeight(tmpl.messagesInitSize);
                autosize.update($(e.currentTarget));
            }
        }
    },
    'click .js-chat-box-header-close'() {
        openedChats.remove({userSessionId: this.userSessionId});
    },
    // autosize textarea plugin events
    'autosize:resized .js-chat-submit-input'(e) {
        const tmpl = Template.instance();
        const messages = tmpl.$('.js-chat-messages');
        const input = $(e.currentTarget);
        const textareaSize = input.outerHeight();
        const messagesSize = messages.outerHeight();
        const initialSizesSum = tmpl.textareaInitSize + tmpl.messagesInitSize;
        if (textareaSize + messagesSize > initialSizesSum) {
            messages.outerHeight(initialSizesSum - textareaSize);
            messages[0].scrollTop = messages[0].scrollHeight;
        }
    }
});

Template.footerSmall.helpers({
    isListingView() {
        return FlowRouter.getRouteName() === 'clientAppList';
    }
});
Template.footerSmall.events({
    'click .js-docs-link': App.goToTheDocsSection
});