
var RenderableObject = {
	_toRender: false,
}

var RenderablePrototype = {
	render: function () {
		if ( this._toRender ) {
			this._toRender = false;
			this.buildView();
			return true;
		} else {
			return false;
		}
	},
	queRender: function () {
		App.render.que( this );
		this._toRender = true;
	}
}
