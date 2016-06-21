
var App = {
	log: true,
	logWarns: true,
	logErrors: true,
	throwErrors: false,
	key: {
		Shift: false,
		Alt: false,
		Control: false,
	},
	view: {
		svgFrame: null,
		linkLayer: null,
		blockLayer: null,
		modalLayer: null,
		controlLayer: null,
		pointer: null,
	},
	askPreventDefault: function ( evt, type, detail ) {
		var prevent = false;

		prevent = type == 'key' && !Controller.text && this.key[ detail ] != undefined;

		prevent = type == 'grab';

		return prevent ? evt.preventDefault() : false;
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
	log: function ( ) {
		if ( App.log ) console.log.apply( console, arguments );
	},
	warn: function ( ) {
		if ( App.logWarns ) console.warn.apply( console, arguments );
	},
	error: function ( ) {
		if ( App.logErrors ) {
			console.error.apply( console, arguments );
			if ( App.throwErrors ) {
				throw arguments;
			}
		}
	},
	buildView: function () {
		var view = this.view;
		view.svgFrame = App.new({
			type: 'svg',
			id: 'svgFrame',
			c: 'svgFrame',
			e: 'svgFrame',
			p: document.body,
			ns: NS.svg,
			attr: {
				width: 10000,
				height: 10000,
			}
		});
		view.linkLayer = App.new({
			type: 'g',
			id: 'svgLinkLayer',
			c: 'svgLinkLayer',
			e: 'svgLinkLayer',
			p: view.svgFrame,
			ns: NS.svg,
			attr: {
			}
		});
		view.blockLayer = App.new({
			type: 'g',
			id: 'svgBlockLayer',
			c: 'svgBlockLayer',
			e: 'svgBlockLayer',
			p: view.svgFrame,
			ns: NS.svg,
			attr: {
			}
		});
		view.modalLayer = App.new({
			type: 'div',
			id: 'modalLayer',
			c: 'modalLayer',
			e: 'modalLayer',
			p: document.body,
		});
		view.controlLayer = App.new({
			type: 'div',
			id: 'controlLayer',
			c: 'controlLayer',
			e: 'controlLayer',
			p: document.body,
		});
		view.pointer = App.new({
			type: 'div',
			id: 'controlVisuals',
			c: 'controlVisuals',
			e: 'controlVisuals',
			p: view.controlLayer,
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
			if ( Actions.list[ typeName ] ) {
				for ( var event in Actions.list[ typeName ] ) {
					element.addEventListener( event, Actions.list[ typeName ][ event ] );
				}
			}
		}
	},
};

