
/*
When you see this, it is likely to be a setter/getter, if not stated othervise:
	
	someObject = {
		...
		property: function ( arg ) {
			if ( typeof arg != 'undefined' ) {
				...
			} else {
				...
			}
		},
		...
	};

'with' keyword is widely used, and frequently with 'this' as an argument




TODO:

	- proper TODO list
*/





App.buildView();

App.bindEvents( window, 'window' );

App.load();

window.onunload = App.save;
