
// Object.prototype.keys = function () { return Object.keys( this ) } // because fuck everybody

Object.defineProperty( Object.prototype, 'keys', {
	enumerable: false,
	configurable: false,
	writeable: false,
	value: function () { return Object.keys( this ) },
});


App.buildView();

App.bindEvents( window, 'window' );

App.load();

window.onunload = App.save;
