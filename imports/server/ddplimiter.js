import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

// We limit DDP calls here
// http://docs.meteor.com/#/full/ddpratelimiter

// all Method names
const METHODS_NAMES = [
    'addMessage',
    'addClient',
    'removeClient',
    'removeChatMessages',
    'banUserIp'
];

// Only allow 5 list operations per connection per 2 seconds
DDPRateLimiter.addRule({
    name(name) {
        return _.contains(METHODS_NAMES, name);
    },
    // Rate limit per connection ID
    connectionId() {
        return true;
    }
}, 5, 2000);