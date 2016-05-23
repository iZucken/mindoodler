
var App = {
	key: {
		Shift: false,
		Alt: false,
		Control: false,
	},
	view: {
		svgframe: null,
		layers: {
			block: null,
			link: null,
			text: null,
			modal: null,
			control: null,
		},
	},
	askPreventDefault: function ( evt, type, detail ) {
		var prevent = false;

		prevent = type == 'key' && !Controller.text && this.key[ detail ] != undefined;

		prevent = type == 'grab';

		return prevent ? evt.preventDefault() : false;
	},
	update: function ( arg ) {
		Controller.calculateState( );
	},
	save: function ( arg ) {
		/*
			I can't just use json.serialize
			because blocks and links refer to each other
		*/
		var data = '{' +
			'"blocks": [' + Block._list.join(',') + '],' +
			'"links": [' + Link._list.join(',') + ']' +
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
	log: function ( args ) {
		true && console.log.apply( console, arguments );
	},
	warn: function ( args ) {
		true && console.warn.apply( console, arguments );
	},
	buildView: function () {
		var view = this.view;
		view.svgframe = App.new({
			type: 'svg',
			id: 'svgframe',
			c: 'svgframe',
			e: 'svgframe',
			p: document.body,
			ns: NS.svg,
			attr: {
				width: 10000,
				height: 10000,
			}
		});
		view.layers.link = App.new({
			type: 'g',
			id: '',
			c: '',
			e: '',
			p: view.svgframe,
			ns: NS.svg,
			attr: {
		    }
		});
		view.layers.block = App.new({
			type: 'g',
			id: '',
			c: '',
			e: '',
			p: view.svgframe,
			ns: NS.svg,
			attr: {
		    }
		});
		/*
		view.layers.modal = App.new({
			type: 'g',
			id: '',
			c: '',
			e: '',
			p: view.svgframe,
			ns: NS.svg,
			attr: {
				'pointer-events': 'visiblePainted',
		    }
		});
		*/
		view.control = App.new({
			type: 'div',
			id: 'controlVisuals',
			c: 'controlVisuals',
			e: 'controlVisuals',
			p: document.body,
		});
	},
	new: function ( arg ) {
		var doc = arg.doc || document,
			type = arg.type || 'div',
			className = arg.className || arg.class || arg.c,
			id = arg.id,
			text = arg.text || arg.t,
			childs = arg.childs || arg.ch || [],
			parent = arg.parent || arg.p,
			value = arg.value || arg.val || arg.v,
			name = arg.name || arg.n,
			eventsList = arg.eventsList || arg.events || arg.e,
			style = arg.style || arg.s,
			props = arg.prop,
			attrList = arg.attr,
			ns = arg.ns,
			e = ns ? doc.createElementNS( ns, type ) : doc.createElement( type );

		if ( className ) { e.className = className }
		if ( id ) { e.id = id }
		if ( text ) { e.innerHTML = text }
		if ( name ) { e.name = name }
		if ( props ) {
			for ( var prop in props ) {
				e[prop] = props[prop];
			}
		}

		style && e.setAttribute( 'style', style );
		attrList && domSetAttributes( e, attrList );
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
			if ( Events.list[ typeName ] ) {
				for ( var event in Events.list[ typeName ] ) {
					element.addEventListener( event, Events.list[ typeName ][ event ] );
				}
			}
		}
	},
};

