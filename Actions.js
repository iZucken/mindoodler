
var Actions = {


	handlers: {
		default: {
			states: {
				default: function ( arg ) {
					App.log( 'Default event proxy handler invoked with: ', arg );
				},
			},
		},
		hover: {
			states: {
				start: function ( arg ) {
					Controller.hover = arg.target;
					Controller.hoverType = arg.type;
				},
				stop: function ( arg ) {
					if ( !Controller.hold && Controller.hover == arg.target ) {
						Controller.hover = null;
						Controller.hoverType = null;
					}
				},
			},
		},
		create: {
			states: {
				start: function ( arg ) {
					Controller.mode = 'create';
					Controller.hold = new Block( Controller.pos() );
				},
				finish: function ( arg ) {
					Controller.mode = 'default';
				},
			},
		},
		resize: {
			states: {
				start: function ( arg ) {
					Controller.mode = 'resize';
				},
				move: function ( arg ) {
				},
				finish: function ( arg ) {
					Controller.mode = 'default';
				},
			},
		},
		drag: {
			states: {
				grab: function ( arg ) {
					Controller.hold( arg.target._owner );
					Controller.drag( Controller.pos() );
					Controller.mode = 'drag';
				},
				move: function ( arg ) {
					Controller.hold().dim( Controller.drag() );
				},
				drop: function ( arg ) {
					Controller.hold( null );
					Controller.drag( null );
					Controller.mode = 'default';
				},
			},
		},
		link: {
			states: {
				begin: function ( arg ) {
					var link = new Link({
						from: arg.target._owner,
						fromPoint: v2d.p( Controller.pos(), arg.target._owner.dims ),
						fromType: 'block',
						to: Controller.pos(),
						toPoint: v2d.p( Controller.pos(), Controller.lastPos ),
						toType: 'point',
					});
					Controller.hold = link;
					Controller.holdType = 'link-to';
					Controller.mode = 'link';
				},
				from: function ( arg ) {
					var link = Controller.hold;
					switch ( arg.type ) {
						case 'block':
							link.from = arg.target._owner;
							link.fromPoint = v2d.p( Controller.pos(), arg.target._owner.dims );
							break;
						case 'point':
							link.from = arg.target;
							link.fromPoint = v2d.p( Controller.pos(), Controller.lastPos );
							break;
					}
					link.fromType = arg.type;
					link.buildAttribs();
				},
				to: function ( arg ) {
					var link = Controller.hold;
					switch ( arg.type ) {
						case 'block':
							link.to = arg.target._owner;
							link.toPoint = v2d.p( Controller.pos(), arg.target._owner.dims );
							break;
						case 'point':
							link.to = arg.target;
							link.toPoint = v2d.p( Controller.pos(), Controller.lastPos );
							break;
					}
					link.toType = arg.type;
					link.buildAttribs();
				},
				finish: function ( arg ) {
					var link = Controller.hold;
					switch ( arg.type ) {
						case 'block':
							link.to = arg.target._owner;
							link.toPoint = v2d.p( Controller.pos(), arg.target._owner.dims );
							break;
						case 'point':
							link.to = arg.target;
							link.toPoint = v2d.p( Controller.pos(), Controller.lastPos );
							break;
					}
					link.toType = arg.type;
					link.buildAttribs();
					Controller.hold = null;
					Controller.holdType = null;
					Controller.mode = 'default';
				},
			},
		},
	},

	proxy: function ( arg ) {
		var	handler = arg.handler ? Actions.handlers[ arg.handler ] : Actions.handlers.default,
			event = arg.event || null,
			state = arg.state || 'default'
			params = arg.params || {};
		if ( typeof handler == 'undefined' ) {
			App.warn( 'Undefined handler: ' + arg.handler );
		} else {
			params.event = event;
			handler.states[ state ]( params );
		}
		//App.update( event );
		//event && event.preventDefault();
	},

	/*
	
		List of assigned event handlers
	
	*/

	list: {
		window: {
			keydown: function ( event ) {
				var key = event.key || event.keyIdentifier;
				App.key[ key ] = App.key[ key ] != undefined ? true : undefined;
				App.askPreventDefault( event, 'key', key );
				// chrome scaling
				// if ( event.ctrlKey == true && ( cwrk.indexOf( event.which ) != -1 )) {
				// 	event.preventDefault();
				// };
				Actions.proxy( { event: event } );
			},
			keyup: function ( event ) {
				var key = event.key || event.keyIdentifier;
				App.key[ key ] = App.key[ key ] != undefined ? false : undefined;
				App.askPreventDefault( event, 'key', key );
				Actions.proxy( { event: event } );
			},
			mousemove: function ( event ) {
				Controller.pos( { x: event.clientX, y: event.clientY } );
				if ( Controller.hold() ) {
					switch ( event.buttons ) {
						case 1:
							Actions.proxy( {
								event: event,
								handler: 'drag',
								state: 'move',
								params: { },
							} );
							break;
						case 2:
							Actions.proxy( {
								event: event,
								handler: 'resize',
								state: 'move',
								params: { },
							} );
							break;
						case 4:
							var type = Controller.hoverType == 'block' ? 'block' : 'point';
							Actions.proxy( {
								event: event,
								handler: 'link',
								state: 'to',
								params: { type: type, target: Controller.hoverType == 'block' ? this : null },
							} );
							break;
					}
				}
			},
			mouseup: function ( event ) {
				( event.button == 0 ) && Actions.proxy( {
					event: event,
					handler: 'drag',
					state: 'drop',
				} );
				( event.button == 2 ) && Actions.proxy( {
					event: event,
					handler: 'resize',
					state: 'stop',
				} );
			},
			wheel: function ( event ) {
				if ( event.ctrlKey == true ) {
					event.preventDefault();
				}
			},
			mousewheel: function ( event ) {
				if ( event.ctrlKey == true ) {
					event.preventDefault();
				}
			},
			DOMMouseScroll: function ( event ) {
				if ( event.ctrlKey == true ) {
					event.preventDefault();
				}
			},
		},
		svgFrame: {
			mouseup: function ( event ) {
				( event.button == 1 ) && Actions.proxy( {
					event: event,
					handler: 'link',
					state: 'finish',
					params: { type: 'point' },
				} );
			},
		},
		svgLink: {
			mouseleave: function ( event ) {
				Actions.proxy( {
					event: event,
					handler: 'hover',
					state: 'stop',
				} );
			},
			mouseenter: function ( event ) {
				Actions.proxy( {
					event: event,
					handler: 'hover',
					state: 'start',
					params: { type: 'link' },
				} );
			},
		},
		svgConnector: {
		},
		svgBlock: {
			wheel: function ( event ) {
			},
			mouseup: function ( event ) {
				( event.button == 1 ) && Actions.proxy( {
					event: event,
					handler: 'link',
					state: 'finish',
					params: { type: 'block', target: this },
				} );
			},
			mousedown: function ( event ) {
				event.preventDefault();
				switch ( event.button ) {
					case 0:
						Actions.proxy( {
							event: event,
							handler: 'drag',
							state: 'grab',
							params: { type: 'block', target: this },
						} );
						break;
					case 1:
						Actions.proxy( {
							event: event,
							handler: 'link',
							state: 'begin',
							params: { type: 'block', target: this },
						} );
						break;
					case 2:
						Actions.proxy( {
							event: event,
							handler: 'resize',
							state: 'start',
							params: { type: 'block', target: this },
						} );
						break;
				}
			},
			mouseleave: function ( event ) {
				Actions.proxy( {
					event: event,
					handler: 'hover',
					state: 'stop',
					params: { type: 'block', target: this },
				} );
			},
			mouseenter: function ( event ) {
				Actions.proxy( {
					event: event,
					handler: 'hover',
					state: 'start',
					params: { type: 'block' },
				} );
			},
		},
	}
}


