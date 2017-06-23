
var Project = function ( arg ) {
	this.layers = [];
	this.blocks = [];
	this.links = [];
	Project.current = this;
};

Project.extend({
	current: null,
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
				attributes: function () {
					var e = [
						0 +','+ 0,
						-5 +','+ -10,
						5 +','+ -10
					];
					return { points: e };
				}
			}
		}
	},
	uid: function(){
		return Project.current.uid.get();
	}
});

Project.prototype.extend({
	initialize: function () {},
	load: null,
	save: null,
	uid: {
		_last: 0,
		get: function () {
			return this._last++;
		}
	}
});
