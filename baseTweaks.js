
/*

	B E C A U S E

*/

Object.defineProperty( Object.prototype, 'defineProperty', {
	enumerable: false,
	configurable: false,
	writeable: false,
	value: function ( args ) { Object.defineProperty( this, args.name, args ) },
});

Object.prototype.defineProperty({
	name: 'keys',
	enumerable: false,
	configurable: false,
	writeable: false,
	value: function () { return Object.keys( this ) },
});

Object.prototype.defineProperty({
	name: 'extend',
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
});
