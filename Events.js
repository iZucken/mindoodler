
var Events = {
	binds: {
	},
	handlers: {
		default: {
			states: {
				default: function ( arg ) {
					App.log( 'defaultEventHandlerCall' );
				},
			},
		},
		hover: {
			states: {
				start: function ( arg ) {
					Controller.hover = arg.event.target;
					Controller.hoverType = arg.target;
				},
				stop: function ( arg ) {
					Controller.hover = null;
				},
			},
		},
	},
	proxy: function ( arg ) {
		var	handler = arg.handler ? Events.handlers[ handler ] : 'default',
			event = arg.event,
			state = arg.state || 'default',
			target = arg.target || null;

		var handler = Events.handlers[ handler ];

		handler.states[ state ]( { event: event, target: target } );

		App.log( Controller.hover );
		
		App.update( event );
	},
	list: {
		window: {
			keydown: function ( evt ) {
				var key = evt.key || evt.keyIdentifier;
				App.key[ key ] = App.key[ key ] != undefined ? true : undefined;
				
				App.askPreventDefault( evt, 'key', key );
				App.update( evt );

				// chrome scaling
				// if ( evt.ctrlKey == true && ( cwrk.indexOf( evt.which ) != -1 )) {
				// 	evt.preventDefault();
				// };
				Events.proxy( { event: evt } );
			},
			keyup: function ( evt ) {
				var key = evt.key || evt.keyIdentifier;
				App.key[ key ] = App.key[ key ] != undefined ? false : undefined;
				
				App.askPreventDefault( evt, 'key', key );
				Events.proxy( { event: evt } );
			},
			mousedown: function ( evt ) {
			},
			mouseup: function ( evt ) {
			},
			mousemove: function ( evt ) {
				Controller.setPos( evt.clientX, evt.clientY );
				if ( Controller.drags ) {
					Controller.drags._owner.setDims( Controller.deltaDrag(), true );
					Controller.setDragOrigin( Controller.pos.x, Controller.pos.y );
				}
				// if ( Controller.resizes ) {
				// 	Controller.resizes._owner.setDims( Controller.deltaResize(), false );
				// }
				Events.proxy( evt );
			},
			wheel: function ( evt ) {
				if ( evt.ctrlKey == true ) {
					evt.preventDefault();
				}
			},
			mousewheel: function ( evt ) {
				if ( evt.ctrlKey == true ) {
					evt.preventDefault();
				}
			},
			DOMMouseScroll: function ( evt ) {
				if ( evt.ctrlKey == true ) {
					evt.preventDefault();
				}
			},
		},
		svgLayer: {
			mouseup: function ( evt ) {
				Controller.free = ! ( Controller.drags || Controller.resizes || Controller.links );
				if ( Controller.free ) {
					if ( Controller.state == 'newElement' ) {
						new Block( Controller.pos );
					}
				}
				Controller.drags = null;
				Controller.resizes = null;
				Controller.links = null;
			},
			mousemove: function ( evt ) {
				Events.proxy( { event: evt } );
			},
		},
		svgLine: {
			wheel: function ( evt ) {
				Events.proxy( { event: evt } );
			},
			mouseup: function ( evt ) {
				if ( Controller.state == 'deleteUniversal' ) {
					App.log('Trying to delete line');
					this._owner.destroy();
				};
				Controller.drags = null;
				Controller.resizes = null;
				Controller.links = null;
				Events.proxy( { event: evt } );
			},
			mouseleave: function ( evt ) {
				Controller.hover = null;
				Events.proxy( { event: evt } );
			},
			mouseenter: function ( evt ) {
				Controller.hover = evt.target;
				Events.proxy( { event: evt } );
			},
		},
		svgConnector: {
			wheel: function ( evt ) {
				Events.proxy( { event: evt } );
			},
			mouseleave: function ( evt ) {
				Controller.hover = null;
				Events.proxy( { event: evt } );
			},
			mouseenter: function ( evt ) {
				Controller.hover = evt.target;
				Events.proxy( { event: evt } );
			},
			mouseup: function ( evt ) {
				Controller.drags = null;
				Controller.links = null;
				Events.proxy( { event: evt } );
			},
		},
		svgBlock: {
			wheel: function ( evt ) {
				if ( Controller.state == 'toggleShape' ) {
					this._owner.toggleShape( evt.deltaY > 0 ? true : false );
				}
				if ( Controller.state == 'toggleStyle' ) {
					this._owner.toggleStyle( evt.deltaY > 0 ? true : false );
				}
				App.askPreventDefault( evt, 'wheel' );
			},
			mouseup: function ( evt ) {
				var block = this._owner;
				Controller.drags = null;
				if (
					Controller.state == 'linking'
					&& Controller.links
					&& this !== Controller.links.obj.view.block
				) {
					var offset = v2d.p( Controller.pos, block.dims );
					new Link({
						from: Controller.links.obj,
						fromPoint: Controller.links.dim,
						to: block,
						toPoint: offset,
					});
					Controller.links = null;
				} else {
					Controller.links = null;
				};
				App.askPreventDefault( evt, 'grab' );
			},
			mousedown: function ( event ) {
				var block = this._owner;
				if ( Controller.state == 'grab' ) {
					Controller.drags = this;
					Controller.setDragOrigin( Controller.pos.x, Controller.pos.y );
				}
				// if ( Controller.state == 'resize' ) {
				// 	Controller.resizes = this;
				// 	Controller.resizeOrigin = this._owner.dims;
				// }
				if ( Controller.state == 'linking' ) {
					var offset = v2d.p( Controller.pos, block.dims );
					Controller.links = {
						obj: block,
						dim: offset,
					};
				}
				App.askPreventDefault( event, 'grab' );
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
					target: 'block',
				} );
			},
			mousemove: function ( event ) {
				Events.proxy( { event: event } );
			},
		},
	}
}


