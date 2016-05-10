

var svgLayer = New({
	type: 'svg',
	id: 'svgLayer',
	c: 'svgLayer',
	b: 'svgLayer',
	p: document.body,
	ns: NS.svg,
	attr: {
		width: 10000,
		height: 10000,
    }
});

setBehavior( window, 'window' );

App.load();

window.onunload = App.save;