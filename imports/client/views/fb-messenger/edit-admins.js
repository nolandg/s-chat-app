import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FbAdmins } from '../../../both/collections/collections.js';

import './edit-admins.html';

Template.editFbAdmins.onCreated(function () {
  this.subscribe('FbAdmins');
});

Template.editFbAdmins.helpers({
  fbAdmins() {
    const userId = Meteor.userId();
    if (userId) {
      return FbAdmins.find();
    }
  },
});

Template.editFbAdmins.events({
  'click .js-submit-new-admin': function () {
    const tmpl = Template.instance();
    const data = {
      contactId: tmpl.$('#contact-id-input').val(),
      name: tmpl.$('#name-input').val(),
    };
    Meteor.call('addFbAdmin', data, () => {
      tmpl.$('#contact-id-input').val('');
      tmpl.$('#name-input').val('');
    });
  },
  'click .js-remove': function (event) {
    Meteor.call('removeFbAdmin', $(event.target).parent().attr('data-id'));
  },
  'click .js-update': function (event) {
    Meteor.call('updateFbAdmin', {
      _id: $(event.target).parent().attr('data-id'),
      name: $(event.target).siblings('.name').val(),
      contactId: $(event.target).siblings('.contact-id').val(),
    });
  },
});
