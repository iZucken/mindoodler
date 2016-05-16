
var behaviors = {
	window: {
		keydown: function ( evt ) {
			var key = evt.key || evt.keyIdentifier;
			App.key[ key ] = App.key[ key ] != undefined ? true : undefined;
			
			App.update( evt );
			App.askPreventDefault( evt, 'key', key );
		},
		keyup: function ( evt ) {
			var key = evt.key || evt.keyIdentifier;
			App.key[ key ] = App.key[ key ] != undefined ? false : undefined;
			
			App.update( evt );
			App.askPreventDefault( evt, 'key', key );
		},
		mousedown: function ( evt ) {
			Controller.setPos( { x: evt.clientX, y: evt.clientY } );
		},
		mouseup: function ( evt ) {
		},
		wheel: function ( evt ) {
		},
		mousemove: function ( evt ) {
			Controller.setPos( { x: evt.clientX, y: evt.clientY } );
			if ( Controller.drags ) {
				Controller.drags._owner.setDims( Controller.deltaFrom( 'dragOrigin' ), true );
				Controller.dragOrigin = Controller.pos;
			}
			App.update( evt );
		},
	},
	svgLayer: {
		click: function ( evt ) {
			if ( Controller.state == 'newElement' ) {
				new Block( Controller.pos );
			}
		},
		mouseup: function ( evt ) {
			Controller.drags = null;
			Controller.links = null;
			App.update( evt );
		},
	},
	svgLine: {
		wheel: function ( evt ) {
		},
		mouseup: function ( evt ) {
			Controller.drags = null;
			Controller.links = null;
			App.update( evt );
		},
		click: function ( evt ) {
			if ( Controller.state == 'deleteUniversal' ) {
				App.log('Trying to delete line');
				this._owner.destroy();
			}
		},
	},
	svgConnector: {
		wheel: function ( evt ) {
		},
		mouseup: function ( evt ) {
			Controller.drags = null;
			Controller.links = null;
			App.update( evt );
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
			App.update( evt );
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
			App.update( evt );
			App.askPreventDefault( evt, 'grab' );
		},
		mousedown: function ( evt ) {
			var block = this._owner;
			if ( Controller.state == 'grab' ) {
				Controller.drags = this;
				Controller.dragOrigin = Controller.pos;
			}
			if ( Controller.state == 'linking' ) {
				var offset = v2d.p( Controller.pos, block.dims );
				Controller.links = {
					obj: block,
					dim: offset,
				};
			}
			App.update( evt );
			App.askPreventDefault( evt, 'grab' );
		},
		mouseout: function ( evt ) {
			Controller.hover = null;
		},
		mouseover: function ( evt ) {
			Controller.hover = evt.target;
		},
		mousemove: function ( evt ) {
		},
		click: function ( evt ) {
			if ( Controller.state == 'deleteUniversal' ) {
				this._owner.destroy();
			}
		},
	},
};

/*
$(document).ready(function(){
var keyCodes = [61, 107, 173, 109, 187, 189];

$(document).keydown(function(event) {   
   if (event.ctrlKey==true && (keyCodes.indexOf(event.which) != -1)) {
    alert('disabling zooming'); 
    event.preventDefault();
    }
});

$(window).bind('mousewheel DOMMouseScroll', function (event) {
   if (event.ctrlKey == true) {
     alert('disabling zooming'); 
     event.preventDefault();
   }
});
*/