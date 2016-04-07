import { Mongo } from 'meteor/mongo';

// this is only client side storage/collection
// we need it to track currently opened chats
openedChats = new Mongo.Collection(null);