
var Block = function ( arg ) {
	var arg = arg || {};
	var dim = arg.dim || {};

	this.type = 'block';

	this._dim = {
		x: arg.x || dim.x || 0,
		y: arg.y || dim.y || 0,
		w: arg.w || dim.w || Block.last.w,
		h: arg.h || dim.h || Block.last.h
	};
	this.text = arg.text || Block.last.text;
	this.shape = arg.shape || Block.last.shape;
	this.style = arg.style || Block.last.style;
	this.links = [];
	this.view = {
		block: null,
		text: null
	};
	this.uid = Project.uid();
	Block.list.push( this );
	/*
	this.extend( RenderableObject );
	*/
	this.queRender();
};

Block.extend({
	list: [],
	last: {
		text: 'Sample text',
		w: 100,
		h: 100,
		shape: 'ellipse',
		style: 'filled'
	},
	dimsmin: {
		w: 10,
		h: 10
	},
	getAttachPoint: function ( dim, v ) {
		var ar = v2d.angle( v );
		var a = v2d.rad2deg( ar );
		var as = v2d.angle_step4( a );
		var x = dim.x, y = dim.y;
		switch ( as ) {
			case 0:
				x = dim.x + dim.w / 2;
				break;
			case 1:
				y = dim.y - dim.h / 2;
				break;
			case 2:
				x = dim.x - dim.w / 2;
				break;
			case 3:
				y = dim.y + dim.h / 2;
				break;
		};
		return ( { x: x, y: y, as: as, a: a, ar: ar } );
	},
	shapes: {
		rectangle: {
			type: 'rect',
			attributes: function ( ) {
				var dim = this.dim();
				var attributes = {
					x: dim.x - dim.w / 2,
					y: dim.y - dim.h / 2,
					width: dim.w,
					height: dim.h
				}
				return attributes;
			},
			attachPoint: function ( arg ) {
				var dim = this.dim();
				var ar = v2d.angle( arg );
				var a = v2d.rad2deg( ar );
				var as = v2d.angle_step4( a );
				var x = dim.x, y = dim.y;
				switch ( as ) {
					case 0:
						x = dim.x + dim.w / 2;
						break;
					case 1:
						y = dim.y - dim.h / 2;
						break;
					case 2:
						x = dim.x - dim.w / 2;
						break;
					case 3:
						y = dim.y + dim.h / 2;
						break;
				};
				return ( { x: x, y: y, as: as, a: a, ar: ar } );
			},
			textArea: function ( arg ) {
				with ( this.dim() ) {
					return {
						left: x - w/2,
						top: y - h/2,
						width: w,
						height: h
					};
				}
			}
		},
		ellipse: {
			type: 'ellipse',
			attributes: function ( ) {
				var dim = this.dim();
				var attributes = {
					cx: dim.x,
					cy: dim.y,
					rx: dim.w / 2,
					ry: dim.h / 2
				}
				return attributes;
			},
			attachPoint: function ( arg ) {
				var dim = this.dim();
				var ar = Math.atan2( arg.y, arg.x );
				var a = ( ar + 360 ) % 360;
				var x = dim.x + Math.cos( ar ) * dim.w / 2;
				var y = dim.y + Math.sin( ar ) * dim.h / 2;
				return ( { x: x, y: y, a: a, ar: ar, offset: arg } );
			},
			textArea: function ( arg ) {
				with ( this.dim() ) {
					return {
						left: x - w/4,
						top: y - h/4,
						width: w/2,
						height: h/2
					};
				}
			}
		},
		diamond: {
			type: 'polygon',
			attributes: function ( ) {
				var dim = this.dim();
				var e = {
					x: dim.x - dim.w / 2,
					y: dim.y - dim.h / 2,
					X: dim.x + dim.w / 2,
					Y: dim.y + dim.h / 2
				};
				e = [
					dim.x +','+ e.y,
					e.x +','+ dim.y,
					dim.x +','+ e.Y,
					e.X +','+ dim.y,
				];
				return { points: e };
			},
			attachPoint: function ( arg ) {
				var dim = this.dim();
				var ar = ( Math.atan2( arg.y, arg.x ) - Math.PI / 4 );
				var a = ar / -Math.PI * 180;
				a = ( a + 360 ) % 360;
				a = a - a % 90;
				var x = dim.x, y = dim.y;
				switch ( a ) {
					case 0:
						x = dim.x + dim.w / 2;
						break;
					case 90:
						y = dim.y - dim.h / 2;
						break;
					case 180:
						x = dim.x - dim.w / 2;
						break;
					case 270:
						y = dim.y + dim.h / 2;
						break;
				};
				return ( { x: x, y: y, a: a, ar: ar } );
			},
			textArea: function ( arg ) {
				with ( this.dim() ) {
					return {
						left: x - w/4,
						top: y - h/4,
						width: w/2,
						height: h/2
					};
				}
			}
		}
	},
	styles: {
		outlined: {
			fill: 'rgba(155,155,155,0)',
			stroke: 'rgba(50,50,50,1)',
			'stroke-width': '2'
		},
		'filled': {
			fill: 'rgba(200,200,200,1)',
			stroke: 'rgba(50,50,50,0)',
			'stroke-width': '2'
		},
		'outline-filled': {
			fill: 'rgba(200,200,200,1)',
			stroke: 'rgba(50,50,50,1)',
			'stroke-width': '2'
		},
		'outline-dashed': {
			fill: 'rgba(155,155,155,0)',
			stroke: 'rgba(50,50,50,1)',
			'stroke-width': '2',
			'stroke-dasharray': ' 8, 8 '
		},
		'outline-dash-filled': {
			fill: 'rgba(200,200,200,1)',
			stroke: 'rgba(50,50,50,1)',
			'stroke-width': '2',
			'stroke-dasharray': ' 8, 8 '
		}
	}
});

Block.prototype.extend({
	toString: function () {
		return JSON.stringify( this.getSaveableData() );
	},
	getSaveableData: function () {
		with ( this ) {
			return {
				dim: _dim,
				text: text,
				shape: shape,
				style: style
			};
		};
	},
	destroy: function () {
		this.clearView();
		var links = this.links;
		while ( links[0] ) {
			links[0].destroy();
		};
		this.links = null;
		Block.list.splice( Block.list.indexOf( this ), 1 );
	},
	dim: function ( arg ) {
		if ( typeof arg != 'undefined' ) {
			with ( this._dim ) {
				x = arg.x || x || 0;
				y = arg.y || y || 0;
				w = arg.w || w || 0;
				h = arg.h || h || 0;
			}
			this.queRender();
		} else {
			return this._dim;
		}
	},
	updateLinks: function ( ) {
		for ( var index in this.links ) {
			this.links[ index ].queRender();
		}
	},
	getAttachPoint: function ( arg ) {
		//return Block.shapes[ this.shape ].attachPoint.bind( this )( arg );
		return Block.getAttachPoint( this.dim(), arg );
	},
	toggleShape: function ( backwards ) {
		var keys = Block.shapes.keys(), toggle = keys.indexOf( this.shape ) + ( backwards );
		toggle = toggle < 0 ? toggle = keys.length -1 : toggle >= keys.length ? 0 : toggle;
		this.shape = keys[ toggle ];
		this.buildView();
	},
	toggleStyle: function ( backwards ) {
		var keys = Block.styles.keys(), toggle = keys.indexOf( this.style ) + ( backwards );
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
			};
		};
	},
	buildView: function () {
		this.clearView();
		this.buildShape();
		this.buildAttribs();
		this.buildStyle();
		this.buildText();
		this.view.block.Block = this;
	},
	buildShape: function ( ) {
		var shape = App.new({
			type: Block.shapes[ this.shape ].type,
			events: 'svgBlock',
			parent: App.view.blockLayer,
			ns: NS.svg
		});
		shape._owner = this;
		this.view.block = shape;
	},
	buildAttribs: function ( ) {
		var attributes = Block.shapes[ this.shape ].attributes.bind(this)();
		for ( prop in attributes ) {
			this.view.block.setAttribute( prop, attributes[ prop ]);
		}
	},
	buildText: function ( ) {
		var text = App.new({
			class: 'blockText',
			events: 'svgBlock',
			parent: App.view.textLayer,
			text: this.text
		});
		text._owner = this;
		this.view.text = text;
		var attributes = Block.shapes[ this.shape ].textArea.bind(this)();
		for ( prop in attributes ) {
			text.style[prop] = attributes[ prop ];
		}
	},
	buildStyle: function ( ) {
		var result = '';
		for ( prop in Block.styles[ this.style ] ) {
			result += prop + ':' + Block.styles[ this.style ][ prop ] + ';';
		};
		this.view.block.setAttribute( 'style', result );
	}
});

Block.prototype.extend(Renderable);
