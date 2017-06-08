
var Link = function ( arg ) {
	this.type = 'link';
	//if ( !( arg.from || arg.from_ID && arg.to ) ) throw "Not enough parameters for a link";
	this.from = arg.from || Block.list[ arg.from_ID ];
	this.to = arg.to || Block.list[ arg.to_ID ];
	this.fromPoint = arg.fromPoint || v2d.nil;
	this.toPoint = arg.toPoint || v2d.nil;
	this.fromType = arg.fromType || arg.from.type || 'point';
	this.toType = arg.toType || arg.to.type || 'point';
	this.width = arg.width || Link.last.width;
	this.style = arg.style || Link.last.style;
	this.text = Link.last.text;
	this.unfinalized = arg.unfinalize || arg.unfin || false;
	this.uid = Project.uid.get();

	this.cache = {};
	this.view = {
		path: null,
		line: null,
		underline: null,
		text: null,
		head: null,
		tail: null
	};
	this.extend( RenderableObject );
	this.queRender();
	Link.list.push( this );
	if ( !this.unfinalized ) {
		this.finalize();
	}
};

Link.extend({
	list: [],
	last: {
		width: 2,
		style: 'solid',
		text: 'Sample Text'
	},
	styles: {
		'solid': {
			'fill': 'none',
			'stroke': 'rgba(50,50,50,1)'
		},
		'dashed': {
			'fill': 'none',
			'stroke': 'rgba(50,50,50,1)',
			'stroke-dasharray': ' 8, 8 '
		}
	}
});

Link.prototype.extend({
	toString: function () {
		return JSON.stringify( this.getSaveableData() );
	},
	getSaveableData: function () {
		with ( this ) {
			return {
				from_ID: fromType == 'block' ? Block.list.indexOf( from ) : null,
				from: fromType == 'point' ? JSON.stringify( from ) : null,
				fromPoint: fromPoint,
				fromType: fromType,
				to_ID: toType == 'block' ? Block.list.indexOf( to ) : null,
				to: toType == 'point' ? JSON.stringify( to ) : null,
				toPoint: toPoint,
				toType: toType,
				width: width,
				text: text,
				style: style
			}
		}
	},
	destroy: function () {
		this.clearView();
		if ( !this.unfinalized ) {
			this.from && this.from.links.splice( this.from.links.indexOf( this ), 1 );
			this.to && this.to.links.splice( this.to.links.indexOf( this ), 1 );
		}
		Link.list.splice( Link.list.indexOf( this ), 1 );
	},
	destroyUnlinked: function () {
		for ( link in Link._list ) {
			if ( Link.list[ link ].from == null || Link.list[ link ].to == null ) {
				Link.list[ link ].destroy();
			}
		}
	},
	finalize: function () {
		this.fromType == 'block' && this.from.links.push( this );
		this.toType == 'block' && this.to.links.push( this );
		this.unfinalized = false;
	},
	toggleStyle: function ( backwards ) {
		var keys = Link.styles.keys(), toggle = keys.indexOf( this.style ) + ( backwards );
		toggle = toggle < 0 ? toggle = keys.length -1 : toggle >= keys.length ? 0 : toggle;
		this.style = keys[ toggle ];
		this.buildStyle();
		this.queRender();
	},
	clearView: function ( ) {
		var view = this.view;
		for ( item in view ) {
			if ( view[ item ] != null ) {
				view[ item ].remove();
				view[ item ] = null;
			}
		}
	},
	buildView: function ( ) {
		this.clearView();
		this.view.path = App.new({
			type: 'path',
			parent: App.view.defsLayer,
			id: 'Link_'+this.uid,
			ns: NS.svg
		});
		this.view.path._owner = this;
		this.view.underline = App.new({
			type: 'use',
			events: 'svgLink',
			parent: App.view.linkLayer,
			attr: {
				'href': '#Link_'+this.uid,
				'fill': 'none',
				'stroke': 'white',
				'stroke-width': this.width + 4
			},
			ns: NS.svg
		});
		this.view.underline._owner = this;
		this.view.line = App.new({
			type: 'use',
			events: 'svgLink',
			parent: App.view.linkLayer,
			attr: { 'href': '#Link_'+this.uid },
			ns: NS.svg
		});
		this.view.line._owner = this;
		this.view.text = App.new({
			type: 'textPath',
			events: 'svgLink',
			parent: App.view.linkTextLayer,
			attr: {
				'href': '#Link_'+this.uid,
				'text-anchor': 'middle',
				'startOffset': '50%'
			},
			text: this.text,
			ns: NS.svg
		});
		this.view.text._owner = this;
		this.view.head = App.new({
			type: 'polygon',
			events: 'svgPlug',
			parent: App.view.plugLayer,
			ns: NS.svg
		});
		this.buildAttribs();
		this.buildStyle();
	},
	buildAttribs: function () {
		this.buildLineAttribs();
	},
	buildStyle: function () {
		this.buildLineStyle();
	},
	_calculateLinePoints: function () {
		with ( v2d ) {
			var A, B, a, b, ai, bi;
			with (this) {
				var isA, isB;
				if ( isA = from.dim || false ) {
					A = from.dim();
					a = from.getAttachPoint(fromPoint);
				} else {
					A = {x: from.x, y: from.y, w: 1, h: 1};
					a = fromPoint;
				}
				if ( isB = to.dim || false ) {
					B = to.dim();
					b = to.getAttachPoint(toPoint);
				} else {
					B = {x: to.x, y: to.y, w: 1, h: 1};
					b = toPoint;
				}
			}
			if ( ! (isA && isB) ) {
				return [ A, B ]
			}
			this.cache.a = a;
			this.cache.b = b;
			var angleRemap = [ 1, 0, 3, 2 ]; // to remap angle we get from v2d to CW order
			var min = { x: Math.min( A.x - A.w, B.x - B.w ), y: Math.min( A.y - A.h, B.y - B.h ) };
			var max = { x: Math.max( A.x + A.w, B.x + B.w ), y: Math.max( A.y + A.h, B.y + B.h ) };
			var T = Math.max( A.w/2, B.w/2, A.h/2, B.h/2 );
			var t = Math.min( A.w/2, B.w/2, A.h/2, B.h/2 );
			var ai = angleRemap[a.as];
			var bi = angleRemap[b.as];
			var d = bi - ai;
			if ( Math.abs(d)==3 ) {
				d += ai < bi ? -4 : 4;
			}
			/*
			var middleXMap = [ 0, 1, 0, 1 ];
			var middleXMap_inv = [ 1, 0, 1, 0 ];
			var abi;
			if ( d == 1 ) {
				abi = angleRemap[angle_step4(rad2deg(angle(delta( B, A ))))];
			} else if ( d==-1 ) {
				abi = angleRemap[angle_step4(rad2deg(angle(delta( A, B ))))];
			}
			// if 'rays' from attach points do intersect
			console.log( ai, bi, abi, d );
			if ( Math.abs(d) == 1 ) {
				var X = {
					x: A.x * middleXMap_inv[ai] + B.x * middleXMap_inv[bi],
					y: A.y * middleXMap[ai] + B.y * middleXMap[bi]
				}
				return [ a, X, b ];
			}
			*/
			var dAB = l_len( min, max );
			// this and corresponding attach point define an outgoing line
			var Aa = sum( mul( norm( delta( A, a ) ), dAB ), a );
			var Bb = sum( mul( norm( delta( B, b ) ), dAB ), b );
			var aXb = l_int( a, Aa, b, Bb );
			if ( aXb.a && aXb.b ) {
				return [ a, aXb , b ];
			}
			// if rays from APs intersect the middle lines
			var mid = sum( a, div(delta(a, b), 2)); // mid point between a & b
			var mmap = [
				{x: min.x, y: mid.y},
				{x: mid.x, y: max.y},
				{x: max.x, y: mid.y},
				{x: mid.x, y: min.y}
			];
			var MID = sum( A, div( delta( A, B ), 2 ) ); // mid point between A & B
			var Mmap = [
				{x: min.x, y: MID.y},
				{x: MID.x, y: max.y},
				{x: max.x, y: MID.y},
				{x: MID.x, y: min.y}
			];
			var aXmw = l_int(a, Aa, mmap[0], mmap[2]);
			var bXmw = l_int(b, Bb, mmap[0], mmap[2]);
			var aXmh = l_int(a, Aa, mmap[1], mmap[3]);
			var bXmh = l_int(b, Bb, mmap[1], mmap[3]);
			var XMmap = [
				{ x: a.x, y: MID.y },
				{ x: MID.x, y: a.y },
				{ x: b.x, y: MID.y },
				{ x: MID.x, y: b.y },
			];
			if ( aXmw.i && bXmw.i) {
				return [a, aXmw, bXmw, b];
			} else if (aXmh.i && bXmh.i) {
				return [a, aXmh, bXmh, b];
			}
			// if rays from APs do intersect the same extent line
			var ext = [ // corners of extension quad
				min, // top left
				{x: max.x, y: min.y}, // top right
				max, // bottom right
				{x: min.x, y: max.y}, // bottom left
			];
			var aXext = [
				l_int(a, Aa, ext[0], ext[1]), // top
				l_int(a, Aa, ext[1], ext[2]), // right
				l_int(a, Aa, ext[3], ext[2]), // bottom
				l_int(a, Aa, ext[0], ext[3]) // left
			];
			var bXext = [
				l_int(b, Bb, ext[0], ext[1]),
				l_int(b, Bb, ext[1], ext[2]),
				l_int(b, Bb, ext[3], ext[2]),
				l_int(b, Bb, ext[0], ext[3])
			];
			for ( var i = 0; i <= 3; i++ ) {
				if ( aXext[i].i && bXext[i].i) {
					var af = { p: aXext[i] };
					var bf = { p: bXext[i] };
					// if there is intersection and threshold is bypassed then we return a point, or else
					// we check if path can be made around through the middle line
					if ( l_len( aXext[i], bXext[i] ) > T ) {
						return [a, aXext[i], bXext[i], b];
					} else {
						var exti = i;
					}
				}
			}
			//if nothing of the above, find the best route through already known points
			var filterPoints = function (arg) {
				for ( var i = 0; i <= 3; i++ ) {
					if ( arg[i].i ) {
						return { p: arg[i], i: i };
					}
				}
				throw "No suitable points was found to build a line";
			}
			var p1, p2, p3, p4;
			var imap = [ 0, 1, 2, 3, 0, 1 ]; // map is used for cases when rays go outwards of extent quad
			af = filterPoints( aXext );
			bf = filterPoints( bXext );
			var idx = bf.i - af.i;

			if ( d == -1 ) { // if point should be in a corner
				return [a, af.p, ext[ af.i ], bf.p, b];
				//if ( l_len( ext[ af.i ], af.p ) > T*3 ) {
				//	return [a, af.p, ext[ af.i ], bf.p, b];
				//} else {
				//	return [a, af.p, Mmap[ af.i ], bf.p, b];
				//}
			}
			if ( d == 1 ) { // if point should be in a corner
				return [a, af.p, ext[ bf.i ], bf.p, b];
				//if ( l_len( ext[ bf.i ], bf.p ) > T*3 ) {
				//	return [a, af.p, ext[ bf.i ], bf.p, b];
				//} else {
				//	return [a, af.p, Mmap[ bf.i ], bf.p, b];
				//}
			}

			/*
			if ( Math.abs( idx ) == 1 ) { // if point should be in a corner
				return [a, af.p, ext[ Math.max( af.i, bf.i ) ], bf.p, b];
			}
			if ( Math.abs( idx ) == 3 ) { // notice: special case for upper left corner =(
				return [a, af.p, ext[ 0 ], bf.p, b];
			}
			*/
			if ( Math.abs( idx ) == 2 ) { // if there should be two points in corners ( going CW )
				p1 = ext[ imap [ af.i + 1 ] ];
				p2 = ext[ imap [ af.i + 2 ] ];
				return [a, af.p, p1, p2, bf.p, b];
			}
			if ( idx == 0 ) {
				// case when we can't draw clear path without traversing one of the middle lines
				var mimap = [ 0, 1, 0, 1 ]; // to find which ML we should use, 0 - W, 1 - H
				var whmap = [ 0, 1 ];
				var mXmap = [ aXmw, aXmh, bXmw, bXmh ]; // we use earlier calculated X to find proper point
				if ( mXmap[mimap[af.i]].i ) {
					p1 = XMmap[mimap[af.i]]; // @ this point it is clear that if A doesn't X ML, then it is B
					p2 = Mmap[ imap [ af.i + 0 ] ];
					p3 = ext[ imap [ af.i + mimap[af.i] ] ];
					p4 = bf.p;
				} else {
					p1 = af.p;
					p2 = ext[ imap [ af.i + mimap[af.i] ] ];
					p3 = Mmap[ imap [ af.i + 0 ] ];
					p4 = XMmap[mimap[bf.i]+2]; // shift for B
				}
				return [a, p1, p2, p3, p4, b];
			}
			return [a, b];
		}
	},
	buildLineAttribs: function ( ) {
		var attr = '';
		var points = this._calculateLinePoints();
		/*
		if ( points.length > 2 ) {
			var midpoints = [];
			for ( var i = 0; i < points.length-1; i++ ) {
				midpoints.push( v2d.midv( points[i], points[i+1] ) );
			}
			attr += svgen.line( points[0], midpoints[0] );
			for ( var i = 1; i < points.length-1; i++ ) {
				attr += svgen.qcurve( midpoints[i-1], points[i], midpoints[i] );
			}
			attr += svgen.line( points[ points.length-1 ], midpoints[ midpoints.length-1 ]);
		} else {
			attr += svgen.line( points[0], points[1] );
		}
		*/
		for ( var i = 0; i < points.length-1; i++ ) {
			attr += svgen.line( points[i], points[i+1] );
		}


		this.view.path.setAttribute('d', attr);
	},
	buildLineStyle: function ( ) {
		var result = '';
		for ( prop in Link.styles[ this.style ] ) {
			result += prop + ':' + Link.styles[ this.style ][ prop ] + ';';
		}
		result += 'stroke-width:'+this.width+';';
		this.view.line.setAttribute( 'style', result );
	},
	update: function () {
		;
	}
});

Link.prototype.extend(RenderablePrototype);
