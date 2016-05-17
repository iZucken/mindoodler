
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
	dragOrigin: {
		x: 0,
		y: 0,
	},
	resizeOrigin: {
		x: 0,
		y: 0,
		w: 0,
		h: 0,
	},
	hover: null,
	hold: null,
	free: true,
	drags: null,
	resizes: null,
	linksTo: null,
	linksFrom: null,
	text: false,
	stage: null,
	state: 'default',
	setPos: function ( x, y ) {
		this.pos.x = x;
		this.pos.y = y;
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
		this.state = newState,
		document.body.style.cursor = this.styles[ newState ]
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
