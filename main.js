
App.bindEvents( window, 'window' );
App.view.init();
App.render.start();
App.control.enable();
Ctx.enter( Ctx.list.baseMode );

App.load();

/*
A = new Block({x: 100, y: 100, shape: 'diamond' })

B = new Block({x: 300, y: 300, w: 200, h: 200, shape: 'diamond' })

C = new Block({x: 500, y: 100, shape: 'rectangle'})

D = new Block({x: 1000, y: 300, shape: 'diamond'})

AB = new Link({
	from: A,
	to: B,
	fromPoint: { x: 0, y: 50 },
	toPoint: { x: -50, y: 0 }
})

BC = new Link({
	from: B,
	to: C,
	fromPoint: { x: 50, y: 0 },
	toPoint: { x: 50, y: 0 }
})

CD = new Link({
	from: C,
	to: D,
	fromPoint: { x: 50, y: 0 },
	toPoint: { x: 0, y: 50 }
})
*/