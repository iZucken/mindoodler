
/*

Object.prototype is slightly extended, following keys used:
'props'
'key'
'extend'

*/

Object.defineProperty( Object.prototype, 'props', {
	enumerable: false,
	configurable: false,
	writeable: false,
	value: function ( args ) { Object.defineProperties( this, args ) },
});

Object.prototype.props({
	'keys': {
		enumerable: false,
		configurable: false,
		writeable: false,
		value: function () { return Object.keys( this ) },
	},
	'extend': {
		enumerable: false,
		configurable: false,
		writeable: false,
		value: function ( arg ) {
			if ( typeof arg == 'object' ) {
				for ( item in arg ) {
					if ( arg.hasOwnProperty( item ) ) { this[ item ] = arg[ item ]; }
				}
			}
		}
	},
});
