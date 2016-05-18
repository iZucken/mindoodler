
// Object.prototype.keys = function () { return Object.keys( this ) } // because fuck everybody

Object.defineProperty( Object.prototype, 'keys', {
	enumerable: false,
	configurable: false,
	writeable: false,
	value: function () { return Object.keys( this ) },
});

var svgLayer = App.new({
	type: 'svg',
	id: 'svgLayer',
	c: 'svgLayer',
	e: 'svgLayer',
	p: document.body,
	ns: NS.svg,
	attr: {
		width: 10000,
		height: 10000,
    }
});

App.bindEvents( window, 'window' );

App.load();

window.onunload = App.save;
