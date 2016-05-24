
var Link = function ( arg ) {
	this.from = arg.from || Block.list[ arg.from_ID ] || null;
	this.to = arg.to || Block.list[ arg.to_ID ] || null;

	this.fromPoint = arg.fromPoint;
	this.toPoint = arg.toPoint;

	this.fromType = arg.fromType || null;
	this.toType = arg.toType || null;

	this.fromType == 'block' && this.from.links.push( this );
	this.toType == 'block' && this.to.links.push( this );

	this.width = arg.width || Link.last.width;
	this.style = arg.style || Link.last.style;
	this.text = Link.last.text;

	this.view = {
		line: null,
		outline: null,
		textline: null,
		head: null,
		tail: null,
	}
	this.buildView();
	Link.list.push( this );
};

Link.extend({
	list: [],
	last: {
		width: 3,
		style: 'default',
		text: 'Sample Text',
	},
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
				style: style,
			};
		};
	},
	destroy: function () {
		vthis.clearView();
		this.from && this.from.links.splice( this.from.links.indexOf( this ), 1 );
		this.to && this.to.links.splice( this.to.links.indexOf( this ), 1 );
		Link.list.splice( Link.list.indexOf( this ), 1 );
	},
	destroyUnlinked: function () {
		for ( link in Link._list ) {
			if ( Link.list[ link ].from == null || Link.list[ link ].to == null ) {
				Link.list[ link ].destroy();
			}
		};
	},
	toggleStyle: function ( ) {
	},
	clearView: function ( ) {
		var view = this.view;
		for ( item in view ) {
			if ( view[ item ] != null ) {
				view[ item ].remove();
				view[ item ] = null;
			};
		};
	},
	buildView: function ( ) {
		this.clearView();
		this.buildLine();
		this.buildConnector('head');
		this.buildConnector('tail');
		this.buildAttribs();
		this.buildStyle();
		this.buildText();
	},
	buildAttribs: function () {
		this.buildLineAttribs();
		this.buildConnectorAttribs('head');
		this.buildConnectorAttribs('tail');
	},
	buildStyle: function () {
		this.buildLineStyle();
		this.buildConnectorStyle('head');
		this.buildConnectorStyle('tail');
	},
	buildLine: function ( ) {
		if ( App.view.linkLayer ) {
			var shape = App.new({
				type: 'path',
				events: 'svgLink',
				p: App.view.linkLayer,
				ns: NS.svg,
			});
			this.view.line = shape;
			this.view.line._owner = this;
		} else {
			App.warn( 'Can\'t find link parent layer, aborting visuals.' );
		}
	},
	buildLineAttribs: function ( ) {
		App.log( this.fromPoint );
		var
		a = this.fromType == 'block'
			? this.from.getAttachPoint( this.fromPoint )
			: v2d.add( this.fromPoint, this.from );
		var 
		b = this.toType == 'block'
			? this.to.getAttachPoint( this.toPoint )
			: v2d.add( this.toPoint, this.to ),

		A = this.fromType == 'block' ? {
			x: this.from.dims.x,
			y: this.from.dims.y,
			w: this.from.dims.w,
			h: this.from.dims.h,
		} : {
			x: this.from.x,
			y: this.from.y,
			w: 0,
			h: 0,
		},
		B = this.toType == 'block' ? {
			x: this.to.dims.x,
			y: this.to.dims.y,
			w: this.to.dims.w,
			h: this.to.dims.h,
		} : {
			x: this.to.x,
			y: this.to.y,
			w: 0,
			h: 0,
		},
		ap = v2d.p( a, A ),
		bp = v2d.p( b, B ),
		BAd = v2d.d( B, A ),
		bad = v2d.d( b, a );

		var BAl = v2d.l( BAd );

		var
		ao = {
			x: A.x + ap.x * BAl,
			y: A.y + ap.y * BAl,
		},
		bo = {
			x: B.x + bp.x * BAl,
			y: B.y + bp.y * BAl,
		},
		BAp = v2d.p( B, A ),
		ABp = v2d.p( A, B ),
		M = {
			x: ( A.x + B.x ) / 2,
			y: ( A.y + B.y ) / 2,
		},
		m = {
			x: ( a.x + b.x ) / 2,
			y: ( a.y + b.y ) / 2,
		},
		Mmd = v2d.d( M, m ),
		Mml = v2d.l( Mmd );
		
		var Mpers = v2d.pers( M, B );
		var p = [
			{
				x: a.x + ap.x * A.w / 2,
				y: a.y + ap.y * A.h / 2,
			},
			Mpers.ccw,
			Mpers.cw,
			{
				x: b.x + bp.x * B.w / 2,
				y: b.y + bp.y * B.h / 2,
			},
		];
		var aXb = v2d.lint( a, ao, b, bo );

		var apM = v2d.lint( a, ao, Mpers.cw, Mpers.ccw );
		var bpM = v2d.lint( b, bo, Mpers.cw, Mpers.ccw );
		var aopM = v2d.getIntersectingPerpendicular( p[0], A, Mpers.cw, Mpers.ccw );
		var bopM = v2d.getIntersectingPerpendicular( p[3], B, Mpers.cw, Mpers.ccw );

		var maxd = {
			a: v2d.l( { x: A.w, y: A.h } ),
			b: v2d.l( { x: B.w, y: B.h } ),
			w: Math.max( A.w, B.w ),
			h: Math.max( A.h, B.h ),
		};

		var
		Ai = v2d.i( A, M ),
		Bi = v2d.i( B, M ),
		Aip = v2d.pers( Ai, A ),
		Bip = v2d.pers( Bi, B ),
		Acw = v2d.p( Aip.cw, A ),
		Accw = v2d.p( Aip.ccw, A ),
		Bcw = v2d.p( Bip.cw, B ),
		Bccw = v2d.p( Bip.ccw, B ),
		Acw = v2d.add( A, { x: Acw.x * maxd.a, y: Acw.y * maxd.a } ),
		Accw = v2d.add( A, { x: Accw.x * maxd.a, y: Accw.y * maxd.a } ),
		Bcw = v2d.add( B, { x: Bcw.x * maxd.b, y: Bcw.y * maxd.b } ),
		Bccw = v2d.add( B, { x: Bccw.x * maxd.b, y: Bccw.y * maxd.b } );

		var attr = '';
		attr += ( aXb.a && aXb.b ) ? svgen.line( M, aXb ) : '' ;
		attr += svgen.line( a, p[0] );
		attr += svgen.line( b, p[3] );
		attr += svgen.line( M, p[1] );
		attr += svgen.line( M, p[2] );
		attr += svgen.line( Acw, Accw );
		attr += svgen.line( Acw, Bccw );
		attr += svgen.line( Bcw, Bccw );
		attr += svgen.line( Accw, Bcw );
		attr += ( aopM ) ? svgen.line( p[0], aopM ) : '' ;
		attr += ( bopM ) ? svgen.line( p[3], bopM ) : '' ;
		attr += ( apM && apM.b ) ? svgen.line( a, apM ) : '' ;
		attr += ( bpM && bpM.b ) ? svgen.line( b, bpM ) : '' ;

		if ( aXb.a && aXb.b ) {
			// attr += svgen.ccurve( a, aXb, aXb, b );
			attr += svgen.qcurve( a, aXb, b );
		} else {
		};

		this.view.line.setAttribute( 'd', attr );
	},
	buildLineStyle: function ( ) {
		this.view.line.setAttribute( 'style', 'fill: none; stroke: rgba(0,0,0,1); stroke-width: 1;' );
	},
	buildConnector: function ( which ) {
	},
	buildConnectorAttribs: function ( which ) {
	},
	buildConnectorStyle: function ( which ) {
	},
	buildText: function ( ) {
	},
});
