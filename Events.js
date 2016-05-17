
var Events = {
	handlers: {
		default: {
			states: {
				default: function ( arg ) {
				},
			},
		},
		hover: {
			states: {
				start: function ( arg ) {
					Controller.hover = arg.event.target;
					Controller.hoverType = arg.params.type;
				},
				stop: function ( arg ) {
					Controller.hover = null;
				},
			},
		},
		grab: {
			states: {
				start: function ( arg ) {
					var holded = arg.params.target;
					Controller.hold = Controller.hover;
					Controller.setDragOrigin( Controller.pos.x, Controller.pos.y );
					Controller.mode = 'drag';
				},
				move: function ( arg ) {
					Controller.hold._owner.setDims( Controller.deltaDrag(), true );
					Controller.setDragOrigin( Controller.pos.x, Controller.pos.y );
				},
				stop: function ( arg ) {
					Controller.hold = null;
					Controller.mode = 'default';
				},
			},
		},
		// var offset = v2d.p( Controller.pos, block.dims );
		// new Link({
		// 	from: Controller.links.obj,
		// 	fromPoint: Controller.links.dim,
		// 	to: block,
		// 	toPoint: offset,
		// });
	},
	proxy: function ( arg ) {
		var	handler = arg.handler ? Events.handlers[ arg.handler ] : Events.handlers.default,
			event = arg.event || null,
			state = arg.state || 'default'
			params = arg.params || null;

		if ( typeof handler == 'undefined' ) {
			App.warn( 'Undefined handler: ' + arg.handler );
		} else {
			handler.states[ state ]( { event: event, params: params } );
		}

		
		App.update( event );
		//event && event.preventDefault();
	},
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
				Events.proxy( { event: event } );
			},
			keyup: function ( event ) {
				var key = event.key || event.keyIdentifier;
				App.key[ key ] = App.key[ key ] != undefined ? false : undefined;
				App.askPreventDefault( event, 'key', key );
				Events.proxy( { event: event } );
			},
			mousemove: function ( event ) {
				Controller.setPos( event.clientX, event.clientY );
				/*if ( Controller.drags ) {
					Controller.drags._owner.setDims( Controller.deltaDrag(), true );
					Controller.setDragOrigin( Controller.pos.x, Controller.pos.y );
				}*/
				// if ( Controller.resizes ) {
				// 	Controller.resizes._owner.setDims( Controller.deltaResize(), false );
				// }
				( event.buttons == 1 ) && Events.proxy( {
					event: event,
					handler: 'grab',
					state: 'move',
					params: { },
				} );
				( event.buttons == 2 ) && Events.proxy( {
					event: event,
					handler: 'resize',
					state: 'move',
					params: { },
				} );
				( event.buttons == 4 ) && Events.proxy( {
					event: event,
					handler: 'link',
					state: 'to',
					params: { type: 'point', target: Controller.pos, offset: v2d.p( Controller.pos, Controller.lastPos ) },
				} );
				Controller.lastPos.x = Controller.pos.x;
				Controller.lastPos.y = Controller.pos.y;
			},
			mouseup: function ( event ) {
				( event.button == 0 ) && Events.proxy( {
					event: event,
					handler: 'grab',
					state: 'stop',
				} );
				( event.button == 2 ) && Events.proxy( {
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
		svgLayer: {
			mouseup: function ( event ) {
				Controller.free = ! ( Controller.drags || Controller.resizes || Controller.links );
				if ( Controller.free ) {
					if ( Controller.state == 'newElement' ) {
						new Block( Controller.pos );
					}
				};
				( event.button == 1 ) && Events.proxy( {
					event: event,
					handler: 'link',
					state: 'to',
					params: { type: 'point', target: Controller.pos, offset: v2d.p( Controller.pos, Controller.lastPos ) },
				} );
			},
		},
		svgLink: {
			/*mouseup: function ( event ) {
				if ( Controller.state == 'deleteUniversal' ) {
					App.log('Trying to delete line');
					this._owner.destroy();
				};
				Controller.drags = null;
				Controller.resizes = null;
				Controller.links = null;
				Events.proxy( { event: event } );
			},*/
			mouseleave: function ( event ) {
				Events.proxy( {
					event: event,
					handler: 'hover',
					state: 'stop',
				} );
			},
			mouseenter: function ( event ) {
				Events.proxy( {
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
				if ( Controller.state == 'toggleShape' ) {
					this._owner.toggleShape( event.deltaY > 0 ? true : false );
				}
				if ( Controller.state == 'toggleStyle' ) {
					this._owner.toggleStyle( event.deltaY > 0 ? true : false );
				}
				App.askPreventDefault( event, 'wheel' );
			},
			mouseup: function ( event ) {
				( event.button == 1 ) && Events.proxy( {
					event: event,
					handler: 'link',
					state: 'to',
					params: { type: 'block', target: this, offset: v2d.p( Controller.pos, this._owner.dims ) },
				} );
			},
			mousedown: function ( event ) {
				if ( Controller.state == 'linking' ) {
					var offset = v2d.p( Controller.pos, block.dims );
					Controller.links = {
						obj: block,
						dim: offset,
					};
				}
				App.askPreventDefault( event, 'grab' );

				( event.button == 0 ) && Events.proxy( {
					event: event,
					handler: 'grab',
					state: 'start',
					params: { type: 'block', target: this },
				} );
				( event.button == 1 ) && Events.proxy( {
					event: event,
					handler: 'link',
					state: 'from',
					params: { type: 'block', target: this },
				} );
				( event.button == 2 ) && Events.proxy( {
					event: event,
					handler: 'resize',
					state: 'start',
					params: { type: 'block', target: this },
				} );
			},
			mouseleave: function ( event ) {
				Events.proxy( {
					event: event,
					handler: 'hover',
					state: 'stop',
				} );
			},
			mouseenter: function ( event ) {
				Events.proxy( {
					event: event,
					handler: 'hover',
					state: 'start',
					params: { type: 'block' },
				} );
			},
		},
	}
}


