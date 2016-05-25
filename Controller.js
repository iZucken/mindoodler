
var Controller = {
	styles: {
		// col-resize copy crosshair grab help move pointer progress wait
		'loading': 'wait',
		'newElement': 'cell',
		'linking': 'alias',
		'deleteUniversal': 'not-allowed',
		'default': 'crosshair',
		'toggleShape': 'row-resize',
		'toggleStyle': 'row-resize',
		'resize': 'all-scroll',
		'grab': 'grab',
		'drop': 'grabbing',
	},
	x: 0,
	y: 0,
	pos: {
		x: 0,
		y: 0,
	},
	lastPos: {
		x: 0,
		y: 0,
	},
	_dragOrigin: {
		x: 0,
		y: 0,
	},
	_dragDelta: {
		x: 0,
		y: 0,
	},
	_drag: null,
	set drag ( arg ) {
		if ( arg != null ) {
			console.log ( arg );
			with ( this ) {
				_dragOrigin.x = arg.x;
				_dragOrigin.y = arg.y;
				_dragDelta.x = _dragOrigin.x - pos.x;
				_dragDelta.y = _dragOrigin.y || pos.y;
			};
			this._drag = this._hold;
		} else {
			with ( this._dragOrigin ) {
				x = null;
				y = null;
			};
			with ( this._dragDelta ) {
				x = null;
				y = null;
			};
			this._drag = null;
		}
	},
	get drag ( ) {
		with ( this ) {
			return {
				//x: _dragOrigin.x + ( _dragOrigin.x - pos.x ) + _dragDelta.x,
				//y: _dragOrigin.y + ( _dragOrigin.y - pos.y ) + _dragDelta.y,
				x: _dragOrigin.x,
				y: _dragOrigin.y,
			};
		};
	},
	_holdOrigin: {
		x: 0,
		y: 0,
		w: 0,
		h: 0,
	},
	_hold: null,
	set hold ( arg ) {
		if ( arg != null ) {
			with ( this._holdOrigin ) {
				x = arg.dim.x || arg.x;
				y = arg.dim.y || arg.y;
				w = arg.dim.w || arg.w;
				h = arg.dim.h || arg.h;
			};
			this._hold = arg;
		} else {
			with ( this._holdOrigin ) {
				x = null;
				y = null;
				w = null;
				h = null;
			};
			this._hold = null;
		}
	},
	get hold ( ) {
		return this._hold;
	},
	hover: null,
	free: true,
	resizes: null,
	linksTo: null,
	linksFrom: null,
	text: false,
	stage: null,
	state: 'default',
	view: null,
	buildView: function () {
		this.view = App.new(
		);
	},
	setPos: function ( x, y ) {
		this.pos.x = x;
		this.pos.y = y;
		App.view.pointer.style.top = this.pos.y;
		App.view.pointer.style.left = this.pos.x;
	},
	setDragOrigin: function ( x, y ) {
		this.dragOrigin.x = x;
		this.dragOrigin.y = y;
	},
	deltaDrag: function ( ) {
		return v2d.d( this.dragOrigin, this.pos );
	},
	deltaResize: function ( ) {
		var d = v2d.d( this.pos, this.resizeOrigin );
		return { w: this.resizeOrigin.w + d.x, h: this.resizeOrigin.h + d.y };
	},
	setState: function ( newState ) {
		this.state = newState;
		// document.body.style.cursor = this.styles[ newState ]
	},
	calculateState: function () {
		var state = 'default';

		this.free = ! ( this.drags || this.resizes || this.links );

		state = this.hover && this.free ? 'grab' : state;

		state = App.key.Control && this.free ? 'newElement' : state;

		state = App.key.Shift && this.free ? 'linking' : state;

		state = App.key.Alt && this.free ? 'deleteUniversal' : state;

		state = this.drags ? 'drop' : state;

		this.setState( state );

		return state;
	},
}
