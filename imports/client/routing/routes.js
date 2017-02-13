import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { GAnalytics } from 'meteor/datariot:ganalytics';

import { sChatModal } from '../configs/modal.js';

import 'meteor/juliancwirko:s-id';

import '../views/modals/modal.js';
import '../views/main/main.js';
import '../views/client-app-list/client-app-list.js';
import '../views/promo-index/promo-index.js';
import '../views/docs/docs.js';
import '../views/client-app-view/client-app-view.js';
import '../views/not-found-page/not-found-page.html';
import '../views/fb-messenger/edit-admins.js';

FlowRouter.route('/', {
  triggersEnter: [(context, redirect) => {
    if (Meteor.userId()) {
      redirect('/apps');
    }
  }],
  name: 'promoIndex',
  action() {
        // if you want to use Google Analitics
        // you can also add it in other routes
        // more info: https://atmospherejs.com/datariot/ganalytics
    GAnalytics.pageview();
    BlazeLayout.render('main', { layout: 'promoIndex' });
  },
});

// handle routes with FlowRouter Meteor package
FlowRouter.route('/apps', {
  triggersEnter: [(context, redirect) => {
    if (!Meteor.userId()) {
      redirect('/');
    }
  }],
  name: 'clientAppList',
  action() {
    GAnalytics.pageview();
    BlazeLayout.render('main', { layout: 'clientAppList' });
  },
});

FlowRouter.route('/docs', {
  name: 'docs',
  action() {
    GAnalytics.pageview();
    BlazeLayout.render('main', { layout: 'docs' });
  },
});

FlowRouter.route('/fb-messenger/edit-admins', {
  name: 'editFbAdmins',
  action() {
    GAnalytics.pageview();
    BlazeLayout.render('main', { layout: 'editFbAdmins' });
  },
});

FlowRouter.route('/client/:clientAppId', {
  triggersEnter: [(context, redirect) => {
    if (!Meteor.userId()) {
      redirect('/');
    }
  }],
  name: 'clientAppView',
  action() {
    GAnalytics.pageview();
    BlazeLayout.render('main', { layout: 'clientAppView' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('main', { layout: 'notFoundPage' });
  },
};


// s-id accounts
// see more at: http://s-id.meteor.com

FlowRouter.route('/login', {
  triggersEnter: [(context, redirect) => {
    if (Meteor.userId()) {
      redirect('/apps');
    }
  }],
  name: 'sIdLoginView',
  action() {
    GAnalytics.pageview();
    BlazeLayout.render('main', { layout: 'sIdLoginView' });
  },
});
FlowRouter.route('/sign-up', {
  triggersEnter: [(context, redirect) => {
    if (Meteor.userId()) {
      redirect('/apps');
    }
  }],
  name: 'sIdRegisterView',
  action() {
    GAnalytics.pageview();
    BlazeLayout.render('main', { layout: 'sIdRegisterView' });
  },
});
FlowRouter.route('/forgot-password', {
  name: 'sIdForgotPasswordView',
  action() {
    GAnalytics.pageview();
    BlazeLayout.render('main', { layout: 'sIdForgotPasswordView' });
  },
});
FlowRouter.route('/reset-password/:resetToken', {
  triggersEnter: [(context, redirect) => {
    if (Meteor.userId()) {
      redirect('/apps');
    }
  }],
  name: 'sIdResetPasswordView',
  action() {
    BlazeLayout.render('main', { layout: 'sIdResetPasswordView' });
  },
});

// handle redirect after logout
if (Meteor.isClient) {
  Tracker.autorun(() => {
    if (!Meteor.userId() && _.contains(['clientAppView', 'clientAppList'], FlowRouter.getRouteName())) {
      FlowRouter.go('/');
    }
    if (Meteor.userId() && _.contains(['promoIndex'], FlowRouter.getRouteName())) {
      FlowRouter.go('/apps');
    }
  });
    // clear opened modals on route change
  FlowRouter.triggers.exit([function () {
    if (sChatModal.active.get()) {
      sChatModal.close();
    }
  }]);
}
