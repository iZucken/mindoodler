
// test proxy object for static property emulation

var Pobj = function ( arg ) {
	this.softType = 'Pobj';
};

Pobj.extend({
});

Pobj.prototype.extend({
	/*
	get: function ( ) {
		return this;
	},
	val: function ( ) {
		return {}.extend( this );
	},
	set: function ( obg ) {
		for ( key in obj ) {
			this.key = obj.key;
		}
	}
	*/
});
