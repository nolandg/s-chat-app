Template.docs.onRendered(function () {
    const hash = location.hash;
    const hashNameArr = hash.split('#');
    const hashName = hashNameArr[1];
    if (hashName) {
        App.docsContentTmpl.set('docs-' + hashName);
    }
    if (window.matchMedia('(max-width: 480px)').matches) {
        App.sidebarClosed.set(true);
    }
});

Template.docs.events({
    'click .js-toggle-sidebar'(e) {
        e.preventDefault();
        const sidebarStatus = App.sidebarClosed.get();
        App.sidebarClosed.set(!sidebarStatus);
    },
    'click .js-docs-link'(e) {
        const hash = $(e.currentTarget).attr('href');
        const hashNameArr = hash && hash.split('#');
        const hashName = hashNameArr[1];
        if (hashName) {
            App.docsContentTmpl.set('docs-' + hashName);
        }
    }
});