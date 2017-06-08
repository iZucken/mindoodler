
var v2d = function ( x, y ) {
    return { x: x, y: y }; // huehuehue
};

v2d.extend({
	nil: { x: 0, y: 0 },
	norm: function ( A ) { // normal vector
		var l = this.v_len( A );
		return { x: A.x / l, y: A.y / l };
	},
	delta: function ( A, B ) { // delta of points' coordinates
		return {
			x: B.x - A.x,
			y: B.y - A.y
		};
	},
	l_len: function ( A, B ) { // length of the line
		var d = this.delta( A, B );
		return this.v_len(d);
	},
	v_len: function ( A, B ) { // length of the vector
		return Math.sqrt( A.x * A.x + A.y * A.y );
	},
	l_inv: function ( A, B ) { // LINE inverse
			var d = v2d.delta(A, B);
			return {
				x: A.x - d.x,
				y: A.y - d.y
			}
	},
	v_inv: function ( A ) { // VECTOR inverse
		return {
			x: -A.x,
			y: -A.y
		}
	},
	pers: function (A, B) { // perpendiculars of line AB
		var d = this.delta(A, B);
		return {
			cw: {
				x: A.x + -d.y,
				y: A.y + d.x
			},
			ccw: {
				x: A.x + d.y,
				y: A.y + -d.x
			}
		};
	},
	l_int: function ( a, A, b, B ) { // intersection of lines aA and bB
		var ad = {
			x: A.x - a.x,
			y: A.y - a.y
		};
		var bd = {
			x: B.x - b.x,
			y: B.y - b.y
		};
		var det = ( bd.y * ad.x ) - ( bd.x * ad.y );
		var d = this.delta( b, a );
		var n1 = ( ( bd.x * d.y ) - ( bd.y * d.x ) ) / det;
		var n2 = ( ( ad.x * d.y ) - ( ad.y * d.x ) ) / det;
		return {
			x: a.x + ( n1 * ad.x ), // x = b.x + ( n2 *  bd.x );
			y: a.y + ( n1 * ad.y ), // y = b.x + ( n2 *  bd.y );
			a: n1 > 0 && n1 < 1,
			b: n2 > 0 && n2 < 1,
			i: n1 > 0 && n1 < 1 && n2 > 0 && n2 < 1
		};
	},
	sum: function ( A, B ) { // just a sum of line's coords
		return {
			x: A.x + B.x,
			y: A.y + B.y
		};
	},
	mul: function ( V, l ) { // linear multiplication
		return { x: V.x * l, y: V.y * l };
	},
	div: function ( V, l ) { // linear division
		return { x: V.x / l, y: V.y / l };
	},
	mod: function ( A ) { // modulo of coords
		return {
			x: A.x < 0 ? -A.x : A.x,
			y: A.y < 0 ? -A.y : A.y
		};
	},
	rad2deg: function ( a ) {
		return ( a / -Math.PI * 180 + 360 ) % 360;
	},
	midv: function ( a, b ) {
		return v2d.div( v2d.sum( a, b ) , 2 );
	},
	angle: function ( V ) {
		return Math.atan2( V.y, V.x ) - Math.PI / 4;
	},
	angle_step4: function ( a ) {
		a -= a % 90;
		switch ( a ) {
			case 0:
				return 0;
			case 90:
				return 1;
			case 180:
				return 2;
			case 270:
				return 3;
		}
	},
	getIntersectingPerpendicular: function (V1, V2, T1, T2) {
		var pers = this.pers(V1, V2);
		var cw = this.line_int(V1, pers.cw, T1, T2);
		var ccw = this.line_int(V1, pers.ccw, T1, T2);
		return cw.b ? cw : ccw.b ? ccw : false;
	}
});

