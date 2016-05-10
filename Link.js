
var Link = makeClass ( Link, function ( arg ) {

	this.from = arg.from || Block._list[ arg.from_ID ] || null;
	this.to = arg.to || Block._list[ arg.to_ID ] || null;

	this.fromPoint = arg.fromPoint;
	this.toPoint = arg.toPoint;

	this.from && this.from.links.push( this );
	this.to && this.to.links.push( this );

	this.width = arg.width || this.W;
	this.style = arg.style || '';
	this.view = {
		baseline: null,
		line: null,
		outline: null,
		textline: null,
		head: null,
		tail: null,
	}
	this.buildView();
	this._list.push( this );
}, {
	_list: [],
	W: 3,
	toString: function () {
		return JSON.stringify( this.getSaveableData() );
	},
	getSaveableData: function () {
		with ( this ) {
			return {
				from_ID: Block._list.indexOf( from ),
				fromPoint: fromPoint,
				to_ID: Block._list.indexOf( to ),
				toPoint: toPoint,
				width: width,
				style: style,
			};
		};
	},
	destroy: function () {
		var view = this.view;
		for ( item in view ) {
			if ( view[ item ] != null ) {
				view[ item ].remove();
				view[ item ] = null;
			};
		};
		this.from && this.from.links.splice( this.from.links.indexOf( this ), 1 );
		this.to && this.to.links.splice( this.to.links.indexOf( this ), 1 );
		this._list.splice( this._list.indexOf( this ), 1 );
	},
	destroyUnlinked: function () {
		for ( link in Link._list ) {
			if ( Link._list[link].from == null || Link._list[link].to == null ) {
				Link._list[link].destroy();
			}
		};
	},
	toggleShape: function ( ) {
	},
	toggleStyle: function ( ) {
	},
	clearView: function ( ) {
		var view = this.view;
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
		var shape = New({
			type: 'path',
			behavior: 'svgLine',
			p: svgLayer,
			ns: NS.svg,
		});
		this.view.line = shape;
		this.view.line._owner = this;
	},
	buildLineAttribs: function ( ) {
		var
		a = this.from != null ? this.from.getAttachPoint( this.fromPoint ) : { x: 0, y: 0 },
		b = this.to != null ? this.to.getAttachPoint( this.toPoint ) : { x: 0, y: 0 },
		A = this.from != null ? {
			x: this.from.dims.x,
			y: this.from.dims.y,
			w: this.from.dims.w,
			h: this.from.dims.h,
		} : {
			x: 0,
			y: 0,
			w: 0,
			h: 0,
		},
		B = this.to != null ? {
			x: this.to.dims.x,
			y: this.to.dims.y,
			w: this.to.dims.w,
			h: this.to.dims.h,
		} : {
			x: 0,
			y: 0,
			w: 0,
			h: 0,
		},
		aoff = this.from != null ? v2dToOffN( a, A ) : {
			x: 0,
			y: 0,
		},
		boff = this.to != null ? v2dToOffN( b, B ) : {
			x: 0,
			y: 0,
		},
		// aoff = this.from != null ? {
		// 	x: a.offset.x,
		// 	y: a.offset.y,
		// } : {
		// 	x: 0,
		// 	y: 0,
		// },
		// boff = this.to != null ? {
		// 	x: b.offset.x,
		// 	y: b.offset.y,
		// } : {
		// 	x: 0,
		// 	y: 0,
		// },
		BAd = {
			x: B.x - A.x,
			y: B.y - A.y,
		}
		;

		BAdst = Math.sqrt( BAd.x * BAd.x + BAd.y * BAd.y );

		var
		aout = {
			x: A.x + aoff.x * BAdst,
			y: A.y + aoff.y * BAdst,
		},
		bout = {
			x: B.x + boff.x * BAdst,
			y: B.y + boff.y * BAdst,
		},
		BAoff = v2dToOffN( B, A ),
		ABoff = v2dToOffN( A, B ),
		afac = {
			x: BAoff.x * aoff.x,
			y: BAoff.y * aoff.y,
		},
		bfac = {
			x: ABoff.x * boff.x,
			y: ABoff.y * boff.y,
		},
		m = {
			x: ( A.x + B.x ) / 2,
			y: ( A.y + B.y ) / 2,
		},
		p = [
			{
				x: a.x + aoff.x * A.w / 2,
				y: a.y + aoff.y * A.h / 2,
			},
			{
				x: m.x + BAdst / 2 * -BAoff.y,
				y: m.y + BAdst / 2 * BAoff.x,
			},
			{
				x: m.x + BAdst / 2 * BAoff.y,
				y: m.y + BAdst / 2 * -BAoff.x,
			},
			{
				x: b.x + boff.x * B.w / 2,
				y: b.y + boff.y * B.h / 2,
			},
		],
		fac = afac.x + afac.y + bfac.x + bfac.y,
		i = lineInters( a, aout, b, bout )
		;

		attribute = '';
		attribute += 'M ' + a.x + ',' + a.y + ' ' + 'L ' + p[0].x + ',' + p[0].y + ' ';
		attribute += 'M ' + b.x + ',' + b.y + ' ' + 'L ' + p[3].x + ',' + p[3].y + ' ';
		attribute += 'M ' + m.x + ',' + m.y + ' ' + 'L ' + p[1].x + ',' + p[1].y + ' ';
		attribute += 'M ' + m.x + ',' + m.y + ' ' + 'L ' + p[2].x + ',' + p[2].y + ' ';

		attribute += 'M ' + a.x + ',' + a.y + ' ';

		if ( i.a && i.b ) {
			attribute +=
			'Q ' + i.x + ',' + i.y + ' ' +
			'  ' + b.x + ',' + b.y + ' ';
		} else {
			attribute +=
			'C ' + p[0].x + ',' + p[0].y + ' ' +
			' ' + p[1].x + ',' + p[1].y + ' ' +
			' ' + m.x + ',' + m.y + ' ' +
			'C ' + p[2].x + ',' + p[2].y + ' ' +
			' ' + p[3].x + ',' + p[3].y + ' ' +
			' ' + b.x + ',' + b.y + ' '
			;
		};

		this.view.line.setAttribute( 'd', attribute );
	},
	buildLineStyle: function ( ) {
		this.view.line.setAttribute( 'style', 'fill: none; stroke: rgba(0,0,0,1); stroke-width: 0.5;' );
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
