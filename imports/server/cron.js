import { SyncedCron } from 'meteor/percolate:synced-cron';
import { Meteor } from 'meteor/meteor';
import { Chat } from '../both/collections/collections.js';

// Cron jobs configuration
// we use here percolate:synced-cron package
// learn more at: https://atmospherejs.com/percolate/synced-cron

SyncedCron.config({
    // Log job run details to console
    log: true,

    // Use a custom logger function (defaults to Meteor's logging package)
    logger: null,

    // Name of collection to use for synchronisation and logging
    collectionName: 'cronHistory',

    // Default to using localTime
    utc: true,

    /*
      TTL in seconds for history records in collection to expire
      NOTE: Unset to remove expiry but ensure you remove the index from
      mongo by hand

      ALSO: SyncedCron can't use the `_ensureIndex` command to modify
      the TTL index. The best way to modify the default value of
      `collectionTTL` is to remove the index by hand (in the mongo shell
      run `db.cronHistory.dropIndex({startedAt: 1})`) and re-run your
      project. SyncedCron will recreate the index with the updated TTL.
    */
    collectionTTL: 172800
});

SyncedCron.add({
    name: 'Remove old chat sessions and related messages.',
    schedule(parser) {
        return parser.text('every 1 hour');
    },
    job() {
        cronDeleteOldChatSessions();
    }
});

SyncedCron.start();

// cron task job
// we are deleting old chat sessions and related messages
// we find one client message which is older and remove all with this sessionId
const cronDeleteOldChatSessions = function () {
    const today = new Date();
    const daysAgo = Meteor.settings.public.maxChatHistoryInDays || 3;
    const daysAgoDate = new Date(today.setDate(today.getDate() - daysAgo));
    const chatMessagesCurr = Chat.find({date: {$lt: daysAgoDate}, isFromClient: true});
    const userSessionIds = chatMessagesCurr.map(m => m.userSessionId).filter((item, i, ar) => (ar.indexOf(item) === i));
    userSessionIds.forEach(userSessionId => {
        Chat.remove({userSessionId: userSessionId});
    });
}
