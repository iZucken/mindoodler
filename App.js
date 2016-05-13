
var App = {
	key: {
		Shift: false,
		Alt: false,
		Control: false,
	},
	askPreventDefault: function ( evt, type, detail ) {
		var prevent = false;

		prevent = type == 'key' && !Controller.text && this.key[ detail ] != undefined;

		prevent = type == 'grab';

		return prevent ? evt.preventDefault() : false;
	},
	update: function ( arg ) {
		Controller.calculateState( );
	},
	save: function () {
		var data = '{' +
			'"blocks": [' + Block._list.join(',') + '],' +
			'"links": [' + Link._list.join(',') + ']' +
		'}';
		window.localStorage.setItem( 'last-session', data );
		//window.localStorage.setItem( 'last-session', JSON.stringify( data ) );
	},
	load: function () {
		var data = JSON.parse( window.localStorage.getItem( 'last-session' ) );
		if ( data ) {
			data.blocks.forEach( function ( e, i, a ) {
				new Block( e );
			} );
			data.links.forEach( function ( e, i, a ) {
				new Link( e );
			} );
		};
		window.localStorage.clear( 'last-session' );
	},
	log: function ( args ) {
		true && console.log.apply( console, arguments );
	},
};

