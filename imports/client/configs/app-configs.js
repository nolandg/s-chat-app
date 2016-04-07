import { ReactiveVar } from 'meteor/reactive-var';

export const App = {
    sidebarClosed: new ReactiveVar(false),
    docsContentTmpl: new ReactiveVar('docs-about'),
    goToTheDocsSection: function (e) {
        const hash = $(e.currentTarget).attr('href');
        const hashNameArr = hash && hash.split('#');
        const hashName = hashNameArr[1];
        if (hashName) {
            App.docsContentTmpl.set('docs-' + hashName);
        }
    }
};