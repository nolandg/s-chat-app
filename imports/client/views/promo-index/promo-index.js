import { Template } from 'meteor/templating';
import { App } from '../../configs/app-configs.js';

import './promo-index.html';

Template.promoIndex.events({
    'click .js-docs-link': App.goToTheDocsSection
});