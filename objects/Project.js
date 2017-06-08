
var Project = function ( arg ) {
	this.layers = [];
	this.blocks = [];
	this.links = [];
};

Project.extend({
	styles: {
		lines: {
			solid: {},
			dashed: {},
			dotted: {},
			double: {}
		},
		blocks: {},
		links: {},
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
				points: function ( arg ) {
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
				},
				rotate: function ( arg ) {
					var origin = arg.origin;
					var origin = arg.origin;

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
