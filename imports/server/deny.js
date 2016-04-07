import { Meteor } from 'meteor/meteor';
import {Chat, Client, Banned} from '../both/collections/collections.js';

// Deny client side ingerention
// We deny all because sChat uses only Methods calls
// read more about it here: http://guide.meteor.com/security.html#allow-deny

Meteor.users.deny({
    insert() {
        return true;
    },
    update() {
        return true;
    },
    remove() {
        return true;
    }
});

Chat.deny({
    insert() {
        return true;
    },
    update() {
        return true;
    },
    remove() {
        return true;
    }
});

Client.deny({
    insert() {
        return true;
    },
    update() {
        return true;
    },
    remove() {
        return true;
    }
});

Banned.deny({
    insert() {
        return true;
    },
    update() {
        return true;
    },
    remove() {
        return true;
    }
});