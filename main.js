
App.buildView();

App.bindEvents( window, 'window' );

App.load();

window.onunload = App.save;
