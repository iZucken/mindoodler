var v2d = {
	p: function ( A, B ) { // polar vector
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
	pers: function ( A, B ) { // perpendiculars of line AB
		var d = v2d.d( A, B );
		return {
			cw: {
				x: A.x + -d.y,
				y: A.y + d.x,
			},
			ccw: {
				x: A.x + d.y,
				y: A.y + -d.x,
			},
		};
	},
	lint: function ( a, A, b, B ) { // intersection of lines aA and bB
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
	add: function ( A, B ) { // just a sum of line's coords
		return {
			x: A.x + B.x,
			y: A.y + B.y,
		};
	},
	mul: function ( V, l ) { // yep
		return { x: V.x * l, y: V.y * l };
	},
	m: function ( A ) { // modulo of coords
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
	test: function ( ) {
		if ( arguments.length == 0 ) {
			App.error( 'No arguments!' );
			return false;
		} else {
			for ( var i = 0, l = arguments.length; i < l; i++ ) {
				if ( typeof arguments[i] == 'undefined' ) {
					App.error( 'Undefined variable as argument '+(i+1) );
					return false;
				} else if ( !isObject( arguments[i] ) ) {
					App.error( 'Not an object as argument '+(i+1) );
					return false;		
				} else if ( !( arguments[i].hasOwnProperty( 'x' ) && arguments[i].hasOwnProperty( 'y' ) ) ) {
					App.error( 'Missing some properties of argument '+(i+1) );
					return false;
				} else if ( isNaN( arguments[i].x ) || isNaN( arguments[i].y ) ) {
					App.error( 'Some properties are NaN on argument '+(i+1) );
					return false;
				}
			}
		}
		return true;
	},
};