
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
	_pos: {
		x: 0,
		y: 0,
	},
	_lastPos: {
		x: 0,
		y: 0,
	},
	pos: function ( arg ) {
		if ( typeof arg != 'undefined' ) {
			with ( this ) {
				_lastPos.x = _pos.x;
				_lastPos.y = _pos.y;
				_pos.x = arg.x;
				_pos.y = arg.y;
			}
			App.view.pointer.style.top = arg.y;
			App.view.pointer.style.left = arg.x;
		} else {
			return this._pos;
		} 
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
	drag: function ( arg ) {
		with ( this ) {
			if ( typeof arg != 'undefined' ) {
				if ( arg != null ) {
					if ( _drag == null ) {
						_drag = _hold;
						_dragDelta.x = _holdOrigin.x - _pos.x;
						_dragDelta.y = _holdOrigin.y - _pos.y;
						_dragOrigin.x = _pos.x;
						_dragOrigin.y = _pos.y;
					}
				} else {
					_dragOrigin.x = null;
					_dragOrigin.y = null;
					_dragDelta.x = null;
					_dragDelta.y = null;
					_drag = null;
				}
			} else {
				return {
					x: _pos.x + _dragDelta.x,
					y: _pos.y + _dragDelta.y,
				};
			}
		}
	},
	size: function ( arg ) {
		with ( this ) {

		}
		_pos.
	},
	_holdOrigin: {
		x: 0,
		y: 0,
		w: 0,
		h: 0,
	},
	_hold: null,
	hold: function ( arg ) {
		with ( this ) {
			if ( typeof arg != 'undefined' ) {
				if ( arg != null ) {
					if ( _hold == null ) {
						with ( _holdOrigin ) {
							var dim = arg.dim();
							x = dim.x || arg.x;
							y = dim.y || arg.y;
							w = dim.w || 0;
							h = dim.h || 0;
						};
						_hold = arg;
					}
				} else {
					with ( _holdOrigin ) {
						x = null;
						y = null;
						w = null;
						h = null;
					};
					_hold = null;
				}
			} else {
				return _hold;
			}
		}
	},
	hover: null,
	free: true,
	resizes: null,
	linksTo: null,
	linksFrom: null,
	text: false,
	stage: null,
	state: 'default',
}
