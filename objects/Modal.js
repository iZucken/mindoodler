
var Modal = function ( arg ) {
	this.dimensions = arg.dimensions || null;
	this.content = arg.content || null;
	this.form = null;
	this.inputs = [];
	this.renderForm();
}

Modal.extend({
})

Modal.prototype.extend({
	renderForm: function () {
		with (this) {
			if ( dimensions && content ) {
				form = App.new ( {
					type: 'form',
					class: 'modalForm',
					events: 'modalForm',
					parent: App.view.modalLayer
				} );
				form.style.left = dimensions.x - dimensions.w / 2;
				form.style.top = dimensions.y - dimensions.h / 2;
				form.style.width = dimensions.w;
				form.style.height = dimensions.h;
				form = App.new ( {
					type: 'form',
					class: 'modalForm',
					events: 'modalForm',
					parent: App.view.modalLayer
				} );
			}
		}
	}
})