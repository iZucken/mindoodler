
/*
	Object.prototype is slightly extended, following keys used:
	'props'
	'keys'
	'extend'
*/

Object.defineProperty( Object.prototype, 'props', {
	enumerable: false,
	configurable: false,
	writable: false,
	value: function ( args ) { Object.defineProperties( this, args ) }
});

Object.prototype.props({
	'keys': {
		enumerable: false,
		configurable: false,
		writable: false,
		value: function () { return Object.keys( this ) }
	},
	'extend': {
		enumerable: false,
		configurable: false,
		writable: false,
		value: function ( arg ) {
			if ( typeof arg == 'object' ) {
				for ( item in arg ) {
					if ( arg.hasOwnProperty( item ) ) { this[ item ] = arg[ item ]; }
				}
			}
		}
	}
});

Element.prototype.props({
	'setAttributes': {
		enumerable: false,
		configurable: false,
		writable: false,
		value: function ( attributes ) {
			for ( attribute in attributes ) {
				this.setAttribute( attribute, attributes[ attribute ] );
			}
		}
	}
});
