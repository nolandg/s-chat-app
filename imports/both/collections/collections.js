import { Mongo } from 'meteor/mongo';

export const Banned = new Mongo.Collection('banned');
export const Chat = new Mongo.Collection('chat');
export const Client = new Mongo.Collection('client');
export const FbAdmins = new Mongo.Collection('fbAdmins');
