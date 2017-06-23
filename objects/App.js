
App = {
	project: null,
	new: function ( arg ) {
		var doc = arg.doc || document, // to create element in a different document
			type = arg.type || 'div',
			className = arg.className || arg.class || arg.c, // css class
			id = arg.id, // id attribute
			text = arg.text || arg.t, // not? a very? good? practice?, as text is a different node, but meh
			childs = arg.childs || arg.ch || [], // recursively creates child elements
			parent = arg.parent, // allows to append to desirable element
			value = arg.value || arg.val || arg.v, // for form inputs
			name = arg.name || arg.n, // for forms
			eventsList = arg.eventsList || arg.events || arg.e, // binds listeners to specified events
			style = arg.style || arg.s, // to add inline style (haha lol)
			props = arg.prop, // to add some junk to the otherwise valid DOM element
			attrList = arg.attr,// allows to set attributes directly
			ns = arg.ns, // namespace (for creating valid svg elements in e.g.)
			e = ns ? doc.createElementNS( ns, type ) : doc.createElement( type );


		if ( className ) { e.className = className }
		if ( id ) { e.id = id }
		text && ( e.textContent = text );
		if ( name ) { e.name = name }

		props && e.extend( props );
		style && e.setAttribute( 'style', style );
		attrList && e.setAttributes( attrList );
		eventsList && App.bindEvents( e, eventsList );
		
		if ( childs ) {
			for ( var i = 0; i < childs.length; i++ ) {
				try {
					e.appendChild( childs[ i ] )
				} catch ( err ) {
					console.warn( err );
				}
			}
		}
		if ( parent ) { parent.appendChild( e ) }
		if ( value ) { e.value = value }
		return e;
	},
	bindEvents: function ( element, eventsList ) {
		eventsList = Array.isArray( eventsList ) ? eventsList : [ eventsList ];
		for ( var type in eventsList ) {
			var typeName = eventsList[ type ];

			if ( Events[ typeName ] ) {
				for ( var event in Events[ typeName ] ) {
					element.addEventListener( event, Events[ typeName ][ event ] );
				}
			}

		}
	},
	init: function () {
		this.project = new Project();
		this.view.init();
		this.render.start();
		this.control.enable();
	},
	view: {
		svgFrame: null,
		defsLayer: null,
		linkLayer: null,
		plugLayer: null,
		blockLayer: null,
		linkTextLayer: null,
		textLayer: null,
		modalLayer: null,
		controlLayer: null,
		init: function () {
			this.svgFrame = App.new({
				type: 'svg',
				c: 'svgFrame',
				e: 'svgFrame',
				parent: document.body,
				ns: NS.svg,
				attr: {
					width: 10000,
					height: 10000
				}
			});
			this.defsLayer = App.new({
				type: 'def',
				parent: this.svgFrame,
				ns: NS.svg
			});
			this.linkLayer = App.new({
				type: 'g',
				c: 'svgLinkLayer',
				e: 'svgLinkLayer',
				parent: this.svgFrame,
				ns: NS.svg
			});
			this.plugLayer = App.new({
				type: 'g',
				c: 'svgPlugLayer',
				e: 'svgPlugLayer',
				parent: this.svgFrame,
				ns: NS.svg
			});
			this.linkTextLayer = App.new({
				type: 'text',
				c: 'svgTextLayer',
				e: 'svgTextLayer',
				parent: this.svgFrame,
				ns: NS.svg
			});
			this.blockLayer = App.new({
				type: 'g',
				c: 'svgBlockLayer',
				e: 'svgBlockLayer',
				parent: this.svgFrame,
				ns: NS.svg
			});
			this.debugLayer = App.new({
				type: 'g',
				c: 'svgBlockLayer',
				e: 'svgDebugLayer',
				parent: this.svgFrame,
				ns: NS.svg
			});
			this.textLayer = App.new({
				type: 'div',
				c: 'textLayer',
				e: 'textLayer',
				parent: document.body
			});
			this.modalLayer = App.new({
				type: 'div',
				c: 'modalLayer',
				e: 'modalLayer',
				parent: document.body
			});
			this.controlLayer = App.new({
				type: 'div',
				c: 'controlLayer',
				e: 'controlLayer',
				parent: document.body
			});
		}
	},
	control: {
		_enabled: false,
		enable: function () {
			this._enabled = true;
		},
		disable: function () {
			this._enabled = false;
		}
	},
	render: {
		_que: [],
		_run: true,
		_cycle: function () {
			if ( this._run ) {
				window.requestAnimationFrame( this._cycle.bind( this ) );

				var que = this._que;
				for ( var index in que ) {
					que[index].render()
				}

				this._que = [];
			}
		},
		que: function ( arg ) {
			this._que.push( arg );
		},
		start: function () {
			this._run = true;
			this._cycle();
		},
		stop: function () {
			this._run = false;
		}
	},
	debug: {
		_entities: [],
		_enable: true,
		dot: function dot ( arg ) {
			var e = App.new({
				type: 'ellipse',
				parent: App.view.debugLayer,
				s: 'fill:rgba(0,0,0,0);stroke:rgba(255,0,255,0.5);stroke-width:2;',
				attr: {
					cx: arg.x,
					cy: arg.y,
					rx: 2,
					ry: 2
				},
				ns: NS.svg
			});
			this._entities.push( e );
		},
		flush: function flush () {
			with ( this ) {
				for (var index in _entities) {
					_entities[index].remove();
				}
				_entities = []
			}
		}
	},
	save: function ( arg ) {
		/*
			I can't just use json.serialize here
			because blocks and links refer to each other
		*/
		var data = '{' +
			'"blocks": [' + Block.list.join(',') + '],' +
			'"links": [' + Link.list.join(',') + ']' +
			'}';
		window.localStorage.setItem( 'last-session', data );
		//window.localStorage.setItem( 'last-session', JSON.stringify( data ) );
	},
	load: function ( arg ) {
		var data = JSON.parse( window.localStorage.getItem( 'last-session' ) );
		if ( data ) {
			data.blocks.forEach( function ( e, i, a ) {
				new Block( e );
			} );
			data.links.forEach( function ( e, i, a ) {
				new Link( e );
			} );
		};
		//window.localStorage.clear( 'last-session' );
	},
}