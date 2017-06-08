
var Events = {
	window: {
		keydown: function ( event ) {
			var key = event.key || event.keyIdentifier;
			switch ( key ) {
				case 'Control':
					Controller.keys.Control = true;
					//Acts.controlKeyHold( event );
			}
			//App.askPreventDefault( event, 'key', key );
			// chrome scaling
			// if ( event.ctrlKey == true && ( CWRK.indexOf( event.which ) != -1 )) {
			// 	event.preventDefault();
			// };
		},
		keyup: function ( event ) {
			var key = event.key || event.keyIdentifier;
			switch ( key ) {
				case 'Control':
					Controller.keys.Control = false;
				//Acts.controlKeyRelease( event );
				case 'Escape':
					Acts.escape( event );
			}
			//App.askPreventDefault( event, 'key', key );
		},
		mousemove: function ( event ) {
			Controller.pos( { x: event.clientX, y: event.clientY } );
			Acts.generalMovement( event );
		},
		mouseup: function ( event ) {
			Acts.releaseHold( event );
		},
		wheel: function ( event ) {
		},
		contextmenu: function ( event ) {
			event.preventDefault();
			return false;
		},
		//DOMMouseScroll: function ( event ) {
		//    console.log('DOMMouseScroll');
		//},
		mousewheel: function ( event ) {
			// doesn't work in firefox
		}
	},
	svgFrame: {
		mousedown: function ( event ) {
			switch ( event.button ) {
				case 0:
					if ( Controller.keys.Control )
						Acts.blockCreationStart( event );
			}
		},
		mouseup: function ( event ) {
			switch ( event.button ) {
				case 0:
					Acts.blockCreationFinish( event );
			}
		}
	},
	svgLink: {
		wheel: function ( event ) {
			Acts.toggleStyle( event );
		},
		mouseleave: function ( event ) {
		},
		mouseenter: function ( event ) {
		}
	},
	svgConnector: {
	},
	svgBlock: {
		wheel: function ( event ) {
			Acts.toggleStyle( event );
		},
		mousemove: function ( event ) {
			Acts.blockMovement(event);
		},
		mouseup: function ( event ) {
			Acts.releaseOverBlock( event );
			//event.stopPropagation();
		},
		mousedown: function ( event ) {
			switch ( event.button ) {
				case 0:
					Acts.pickBlock( event );
					break;
				case 1:
					Acts.makeLink( event );
					break;
				case 2:
					Acts.resizeBlock( event );
					break;
			}
			event.preventDefault();
		},
		mouseleave: function ( event ) {
		},
		mouseenter: function ( event ) {
		}
	},
	modalForm: {
		submit: function ( event ) {
			Acts.finishEdit( event );
			event.preventDefault();
		}
	}
};
