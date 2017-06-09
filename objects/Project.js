
var Project = function ( arg ) {
	this.layers = [];
	this.blocks = [];
	this.links = [];
};

Project.extend({
	styles: {
		blocks: {

		},
		links: {
			solid: {},
			dashed: {},
			dotted: {}
		},
		plugs: {

		}
	},
	shapes: {
		blocks: {

		},
		links: {
		},
		plugs: {
			arrow: {
				build: function () {
					return App.new({
						type: 'polygon',
						events: 'svgPlug',
						parent: App.view.plugLayer,
						ns: NS.svg
					});
				},
				destroy: function () {
				},
				update: function ( arg ) {
					var e = {
						x: dim.x - dim.w / 2,
						y: dim.y - dim.h / 2,
						X: dim.x + dim.w / 2,
						Y: dim.y + dim.h / 2
					};
					e = [
						0 +','+ 0,
						-5 +','+ -10,
						5 +','+ -10,
					];
					return { points: e };
				}
			}
		}
	},
	references: {
		media: {
			urls: {
				self: 'self'
			}
		},
		packs: [
			'default',
		]
	},
	uid: {
		_last: 0,
		get: function () {
			return this._last++;
		}
	}
});

Project.prototype.extend({
});
