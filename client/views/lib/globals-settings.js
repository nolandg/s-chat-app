// needs to be managed better when Meteor 1.3 will be released
window.App = window.App || {};

// sidebar toggle, used in docs and app view
App.sidebarClosed = new ReactiveVar(false);
Template.registerHelper('isSidebarClosed', function () {
    return App.sidebarClosed.get();
});

// documentation content section, used to show particular docs content
App.docsContentTmpl = new ReactiveVar('docs-about');
Template.registerHelper('docsContent', function () {
    $('.client-app-content.docs').scrollTop(0);
    return App.docsContentTmpl.get();
});
App.goToTheDocsSection = function (e) {
    const hash = $(e.currentTarget).attr('href');
    const hashNameArr = hash && hash.split('#');
    const hashName = hashNameArr[1];
    if (hashName) {
        App.docsContentTmpl.set('docs-' + hashName);
    }
};
