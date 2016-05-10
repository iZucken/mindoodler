
var Controller = {
	styles: {
		// col-resize copy crosshair grab help move pointer progress wait
		'loading': 'wait',
		'newElement': 'cell',
		'linking': 'alias',
		'deleteUniversal': 'not-allowed',
		'default': 'default',
		'toggleShape': 'row-resize',
		'toggleStyle': 'row-resize',
		'grab': 'grab',
		'drop': 'grabbing',
	},
	x: 0,
	y: 0,
	pos: {
		x: 0,
		y: 0,
	},
	dragOrigin: {
		x: 0,
		y: 0,
	},
	free: true,
	drags: null,
	hover: null,
	linksTo: null,
	linksFrom: null,
	text: false,
	stage: null,
	state: 'default',
	setPos: function ( arg ) {
		this.pos = arg;
	},
	deltaFrom: function ( arg ) {
		var delta = this[ arg ] && { x: this.pos.x - this[ arg ].x, y: this.pos.y - this[ arg ].y };
		return delta ? delta : undefined;
	},
	setState: function ( newState ) {
		this.state = newState,
		document.body.style.cursor = this.styles[ newState ]
	},
	calculateState: function () {
		var state = 'default';

		this.free = !this.drags;

		state = this.hover && this.free ? 'grab' : state;

		state = App.key.Control && this.free ? 'newElement' : state;

		state = App.key.Shift && this.free ? 'linking' : state;

		state = App.key.Alt && this.free ? 'deleteUniversal' : state;

		state = App.key.Control && this.hover && this.free ? 'toggleShape' : state;

		state = App.key.Control && App.key.Alt && this.hover && this.free ? 'toggleStyle' : state;

		state = this.drags ? 'drop' : state;

		this.setState( state );
	},
}
