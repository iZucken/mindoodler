
var Block = function ( arg ) {
	var arg = arg || {};
	var pos = arg.pos || {};
	var size = arg.size || {};
	this.x = arg.x || pos.x || 0;
	this.y = arg.y || pos.y || 0;
	this.w = arg.w || size.w || Block.last.w;
	this.h = arg.h || size.h || Block.last.h;
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
				var attributes = {
					x: this.x - this.w / 2,
					y: this.y - this.h / 2,
					width: this.w,
					height: this.h
				}
				return attributes;
			},
			attachPoint: function ( arg ) {
				var ar = v2d.angle( arg );
				var a = v2d.rad2deg( ar );
				var as = v2d.angle_step4( a );
				var x = this.x, y = this.y;
				switch ( as ) {
					case 0:
						x = this.x + this.w / 2;
						break;
					case 1:
						y = this.y - this.h / 2;
						break;
					case 2:
						x = this.x - this.w / 2;
						break;
					case 3:
						y = this.y + this.h / 2;
						break;
				};
				return ( { x: x, y: y, as: as, a: a, ar: ar } );
			},
			textArea: function ( arg ) {
				with ( this ) {
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
				var attributes = {
					cx: this.x,
					cy: this.y,
					rx: this.w / 2,
					ry: this.h / 2
				}
				return attributes;
			},
			attachPoint: function ( arg ) {
				var ar = Math.atan2( arg.y, arg.x );
				var a = ( ar + 360 ) % 360;
				var x = this.x + Math.cos( ar ) * this.w / 2;
				var y = this.y + Math.sin( ar ) * this.h / 2;
				return ( { x: x, y: y, a: a, ar: ar, offset: arg } );
			},
			textArea: function ( arg ) {
				with ( this ) {
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
				var e = {
					x: this.x - this.w / 2,
					y: this.y - this.h / 2,
					X: this.x + this.w / 2,
					Y: this.y + this.h / 2
				};
				e = [
					this.x +','+ e.y,
					e.x +','+ this.y,
					this.x +','+ e.Y,
					e.X +','+ this.y,
				];
				return { points: e };
			},
			attachPoint: function ( arg ) {
				var ar = ( Math.atan2( arg.y, arg.x ) - Math.PI / 4 );
				var a = ar / -Math.PI * 180;
				a = ( a + 360 ) % 360;
				a = a - a % 90;
				var x = this.x, y = this.y;
				switch ( a ) {
					case 0:
						x = this.x + this.w / 2;
						break;
					case 90:
						y = this.y - this.h / 2;
						break;
					case 180:
						x = this.x - this.w / 2;
						break;
					case 270:
						y = this.y + this.h / 2;
						break;
				};
				return ( { x: x, y: y, a: a, ar: ar } );
			},
			textArea: function ( arg ) {
				with ( this ) {
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
	pos: function () {
		if ( arguments ) {
			return { x: this.x, y: this.y }
		}
	},
	size: function () {
		if ( arguments ) {
			return { w: this.w, h: this.h }
		}
	},
	dim: function () {
		return { x: this.x, y: this.y, w: this.w, h: this.h }
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
	update: function ( arg ) {
		var arg = arg || {};
		var x = arg.x || this.x;
		var y = arg.y || this.y;
		var w = arg.w || this.w;
		var h = arg.h || this.h;
		var changed = [
			false, //position
			false, //size
			false //visual styles
		];
		if ( x != this.x || y != this.y ) {
			changed[0] = true;
			this.x = x;
			this.y = y;
		}
		if ( w != this.w || h != this.h ) {
			changed[1] = true;
			this.w = w;
			this.h = h;
		}
		if ( changed[0] || changed[1] ) {
			this.updateLinks( changed );
		}
		if ( changed[0] + changed[1] + changed[2]  ) {
			this.queRender();
		}
	},
	updateLinks: function ( vals ) {
		for ( var index in this.links ) {
			this.links[ index ].update({ block: this });
		}
	},
	getAttachPoint: function ( arg ) {
		//return Block.shapes[ this.shape ].attachPoint.bind( this )( arg );
		return Block.getAttachPoint( this, arg );
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
