var domSetAttributes = function ( node, attributes ) {
	for ( attribute in attributes ) {
		node.setAttribute( attribute, attributes[ attribute ] );
	}
};

var getById = function ( arg ) {
	return typeof this !== undefined && isDOM( this ) && this !== window ?
	this.getElementById( arg ) :
	document.getElementById( arg );
};

var getByClass = function ( arg ) {
	return typeof this !== undefined && isDOM( this ) && this !== window ?
	this.getElementsByClassName( arg ) :
	document.getElementsByClassName( arg );
};

var isDOMNode = function ( arg ) {
	return (
		typeof Node === "object" ?
		arg instanceof Node : 
		arg && typeof arg === "object" && typeof arg.nodeType === "number" && typeof arg.nodeName==="string"
	);
};

var isDOMElement = function ( arg ) {
	return (
		typeof HTMLElement === "object" ?
		arg instanceof HTMLElement :
		arg && typeof arg === "object" && arg !== null && arg.nodeType === 1 && typeof arg.nodeName==="string"
	);
};

var isDOM = function ( arg ) {
	return isDOMNode( arg ) || isDOMElement( arg );
};


var makeClass = function ( name, constructor, properties ) {
	name = constructor;
	for ( var property in properties ) {
		name[ property ] = properties[ property ];
	}
	name.prototype = name;
	return name;
};


// Object.prototype.keys = function () { return Object.keys( this ) } // because fuck everybody

Object.defineProperty( Object.prototype, 'keys', {
	enumerable: false,
	configurable: false,
	writeable: false,
	value: function () { return Object.keys( this ) },
});

var v2d = {
	p: function ( A, B ) { // polar vector to A from B
		var d = this.d( B, A );
		var l = this.l( d );
		return { x: d.x / l, y: d.y / l };
	},
	d: function ( A, B ) { // delta of points' coordinates
		return {
			x: B.x - A.x,
			y: B.y - A.y,
		};
	},
	D: function ( A, B ) { // distance between points
		var d = {
			x: B.x - A.x,
			y: B.y - A.y,
		};
		return this.l( d );
	},
	l: function ( A, B ) { // length of V
		if ( B ) {
			var d = v2d.d( A, B );
			return Math.sqrt( d.x * d.x + d.y * d.y );
		} else {
			return Math.sqrt( A.x * A.x + A.y * A.y );
		}
	},
	i: function ( A, B ) { // inverse
		if ( B ) {
			var d = v2d.d( A, B );
			return {
				x: A.x - d.x,
				y: A.y - d.y,
			}
		} else {
			return {
				x: -A.x,
				y: -A.y,
			}
		}
	},
	pers: function ( V1, V2 ) { // perpendiculars of V1V2
		var d = v2d.d( V1, V2 );
		return {
			cw: {
				x: V1.x + -d.y,
				y: V1.y + d.x,
			},
			ccw: {
				x: V1.x + d.y,
				y: V1.y + -d.x,
			},
		};
	},
	lint: function ( a, A, b, B ) { // intersection of lines
		var	ad = {
			x: A.x - a.x,
			y: A.y - a.y,
		};
		var	bd = {
			x: B.x - b.x,
			y: B.y - b.y,
		};
		var	det = ( bd.y * ad.x ) - ( bd.x * ad.y );
		var	d = {
			x: a.x - b.x,
			y: a.y - b.y,
		};
		var	n1 = ( ( bd.x * d.y ) - ( bd.y * d.x ) ) / det;
		var	n2 = ( ( ad.x * d.y ) - ( ad.y * d.x ) ) / det;
		return {
			x: a.x + ( n1 * ad.x ), // x = b.x + ( n2 *  bd.x);
			y: a.y + ( n1 * ad.y ), // y = b.x + ( n2 *  bd.y );
			a: n1 > 0 && n1 < 1,
			b: n2 > 0 && n2 < 1,
		};
	},
	add: function ( A, B ) { // just a summ of coords
		return {
			x: A.x + B.x,
			y: A.y + B.y,
		};
	},
	m: function ( A ) { // modulo coords
		return {
			x: A.x < 0 ? -A.x : A.x,
			y: A.y < 0 ? -A.y : A.y,
		};
	},
	getIntersectingPerpendicular: function ( V1, V2, T1, T2 ) {
		var pers = v2d.pers( V1, V2 );
		var cw = v2d.lint( V1, pers.cw, T1, T2 );
		var ccw = v2d.lint( V1, pers.ccw, T1, T2 );
		return cw.b ? cw : ccw.b ? ccw : false;
	},
};

var svgen = {
	line: function ( V1, V2 ) {
		return 'M ' + V1.x + ',' + V1.y + ' L ' + V2.x + ',' + V2.y + ' ';
	},
	qcurve: function ( V1, V2, V3 ) {
		return 'M ' + V1.x + ',' + V1.y + ' Q ' + V2.x + ',' + V2.y + ' ' + V3.x + ',' + V3.y + ' ';
	},
	ccurve: function ( V1, V2, V3, V4 ) {
		return 'M ' + V1.x + ',' + V1.y + ' C ' + V2.x + ',' + V2.y + ' ' + V3.x + ',' + V3.y + ' ' + V4.x + ',' + V4.y + ' ';
	},
}


