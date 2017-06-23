
var Ctx = function () {
	Ctx.current.apply( this, arguments );
};

Ctx.enter = function ( arg ) {
	Ctx.current = arg;
};

Ctx.current = {};
Ctx.data = {};

Ctx.list = {
	baseMode: function ( action, arg ) {
		with ( Ctx ) {
			switch ( action ) {
				case Acts.pickBlock:
					data.target = arg.target._owner;
					data.time = Date.now();
					data.pos = data.target.dim();
					data.cpos = { x: Controller.pos().x, y: Controller.pos().y };
					data.delta = v2d.delta( Controller.pos(), data.target.dim() );
					enter( list.blockActionFilter );
					break;
				case Acts.resizeBlock:
					data.target = arg.target._owner;
					var pos = Controller.pos(),
						dim = data.target.dim(),
						size = { x: dim.w / 2, y: dim.h / 2 };
					data.extend({
						dim: dim,
						initial: { x: pos.x, y: pos.y }, // needed to get rid of reference
						size: size
					});
					enter( list.blockResize );
					break;
				case Acts.makeLink:
					data.from = arg.target._owner;
					var pos = Controller.pos();
					data.link = new Link({
						unfin: true, // important for online link updating
						from: arg.target._owner,
						to: { x: pos.x, y: pos.y },
						fromPoint: v2d.delta( arg.target._owner.dim(), pos ),
						toPoint: v2d.delta( Controller._lastPos, pos )
					})
					enter( list.linkMaking );
					break;
				case Acts.toggleStyle:
					var target = arg.target._owner;
					var wheelDelta = Math.sign( arg.deltaY );
					target.toggleStyle( wheelDelta );
					break;
				case Acts.blockCreationStart:
					data.target = new Block( Controller.pos() );
					enter( list.blockCreation );
			}
		}
	},
	blockActionFilter: function ( act, arg ) {
		with (Ctx) {
			switch (act) {
				case Acts.releaseHold:
					if (Date.now() - data.time < 100) {
						var modal = new Modal({
							dimensions: data.target.dim(),
							content: data.target.text
						});
						enter(list.blockTextEdition);
					} else {
						enter(list.baseMode);
					}
					break;
				case Acts.generalMovement:
					if (v2d.v_len(v2d.delta(data.cpos, Controller.pos())) > 5) {
						enter(list.blockMovement);
						Ctx(act, arg);
					}
					break;
			}
		}
	},
	blockMovement: function ( action, arg ) {
		with ( Ctx ) {
			switch ( action ) {
				case Acts.generalMovement:
					data.target.update({
						dim: v2d.sum( Controller.pos(), data.delta ),
					});
					/*
					data.target.dim( v2d.sum( Controller.pos(), data.delta ) );
					data.target.updateLinks( );
					*/
					break;
				case Acts.releaseHold:
					enter( list.baseMode );
					break;
			}
		}
	},
	blockResize: function ( action, arg ) {
		with ( Ctx ) {
			switch ( action ) {
				case Acts.generalMovement:
					var size = data.size,
						initial = data.initial,
						pos = Controller.pos(),
						dim = data.dim,
						//di = v2d.delta( dim, initial ),
						//dp = v2d.delta( dim, pos ),
						//dpos = v2d.delta( di, dp ),
						dpos = v2d.delta( initial, pos ),
						dsize = v2d.mod( v2d.sum( size, dpos ) );
					console.log( dpos, dsize );
					data.target.dim( { w: dsize.x * 2, h: dsize.y * 2 } );
					data.target.updateLinks( );
					break;
				case Acts.releaseHold:
					enter( list.baseMode );
					break;
			}
		}
	},
	linkMaking: function ( action, arg ) {
		with ( Ctx ) {
			switch ( action ) {
				/*case Acts.generalMovement:
					console.log('general movement link')
					data.link.to = Controller.pos();
					data.link.toType = 'point';
					data.link.queRender();
					break;*/
				case Acts.blockMovement:
					if ( data.from != arg.target._owner ) {
						data.link.to = arg.target._owner;
						data.link.toPoint = v2d.delta( arg.target._owner.dim(), Controller.pos() );
						data.link.toType = arg.target._owner.type;
					} else {
						data.link.to = Controller.pos();
					}
					data.link.queRender();
					break;
				case Acts.releaseHold:
					data.link.destroy();
					enter( list.baseMode );
					break;
				case Acts.releaseOverBlock:
					if ( data.from != arg.target._owner ) {
						data.link.to = arg.target._owner;
						data.link.toPoint = v2d.delta(arg.target._owner.dim(), Controller.pos());
						data.link.toType = arg.target._owner.type;
						data.link.finalize();
						data.link.queRender();
					} else {
						data.link.destroy();
					}
					enter( list.baseMode );
					break;
			}
		}
	},
	blockCreation: function ( action, arg ) {
		with ( Ctx ) {
			switch ( action ) {
				case Acts.generalMovement:
					data.target.dim( Controller.pos() );
					//data.target.updateLinks( ); new block cant have links
					break;
				case Acts.blockCreationFinish:
					//Block( { x: Controller._pos.x, y: Controller._pos.y )
					enter( list.baseMode );
			}
		}
	},
	blockTextEdition: function ( act, arg ) {
		with (Ctx) {
			switch (act) {
				case Acts.finishEdit:
					enter(list.baseMode);
					break;
				case Acts.escape:
					enter(list.baseMode);
					break;
			}
		}
	}
};
