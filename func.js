var domSetAttributes = function ( node, attributes ) {
	for ( attribute in attributes ) {
		node.setAttribute( attribute, attributes[ attribute ] );
	}
};

var getById = function ( arg ) {
	return typeof this !== undefined && isDOM( this ) && this !== window ?
	this.getElementById( arg ) :
	document.getElementById( arg );
};

var getByClass = function ( arg ) {
	return typeof this !== undefined && isDOM( this ) && this !== window ?
	this.getElementsByClassName( arg ) :
	document.getElementsByClassName( arg );
};

var isDOMNode = function ( arg ) {
	return (
		typeof Node === "object" ?
		arg instanceof Node : 
		arg && typeof arg === "object" && typeof arg.nodeType === "number" && typeof arg.nodeName==="string"
	);
};

var isDOMElement = function ( arg ) {
	return (
		typeof HTMLElement === "object" ?
		arg instanceof HTMLElement :
		arg && typeof arg === "object" && arg !== null && arg.nodeType === 1 && typeof arg.nodeName==="string"
	);
};

var isDOM = function ( arg ) {
	return isDOMNode( arg ) || isDOMElement( arg );
};

var v2dToOffN = function ( dim1, dim2 ) { //Converts vector to 0-1 range normalized
	var x = dim1.x - dim2.x;
	var y = dim1.y - dim2.y;
	var r = Math.sqrt( x * x + y * y );
	x = x != 0 ? x / r : 0;
	y = y != 0 ? y / r : 0;
	return { x: x, y: y };
};

var makeClass = function ( name, constructor, properties ) {
	name = constructor;
	for ( var property in properties ) {
		name[ property ] = properties[ property ];
	}
	name.prototype = name;
	return name;
};

var New = function ( arg ) {
	var doc = arg.doc || document,
		type = arg.type || 'div',
		className = arg.className || arg.class || arg.c,
		id = arg.id,
		text = arg.text || arg.t,
		childs = arg.childs || arg.ch || [],
		parent = arg.parent || arg.p,
		value = arg.value || arg.val || arg.v,
		name = arg.name || arg.n,
		behavior = arg.behavior || arg.behave || arg.b,
		style = arg.style || arg.s,
		props = arg.prop,
		attrlist = arg.attr,
		ns = arg.ns,
		e = ns ? doc.createElementNS( ns, type ) : doc.createElement( type );

	if ( className ) { e.className = className }
	if ( id ) { e.id = id }
	if ( text ) { e.innerHTML = text }
	if ( name ) { e.name = name }
	if ( style ) { e.setAttribute( 'style', style ) }
	if ( props ) {
		for ( var prop in props ) {
			e[prop] = props[prop];
		}
	}

	attrlist && domSetAttributes( e, attrlist );
	
	behavior && setBehavior( e, behavior );
	
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
};

var setBehavior = function ( element, behavior ) {
	behavior = behavior && Array.isArray( behavior ) ? behavior : [ behavior ];
	for ( var b_type in behavior ) {
		var b_type_s = behavior[b_type];
		if ( behaviors[b_type_s] ) {
			for ( var b in behaviors[ b_type_s ] ) {
				element.addEventListener( b, behaviors[ b_type_s ][b] );
			}
		} else {
			console.warn( 'No such (' + ( b_type_s || 'empty' ) + ') behaviour for ' + ( element.id || element.name || element.text || element.className || 0 ) + '!' );
		}
	}
};

// Object.prototype.keys = function () { return Object.keys( this ) } // because fuck everybody

Object.defineProperty( Object.prototype, 'keys', {
	enumerable: false,
	configurable: false,
	writeable: false,
	value: function () { return Object.keys( this ) },
});

var lineInters = function ( a, A, b, B ) {
	var	ad = {
		x: A.x - a.x,
		y: A.y - a.y,
	};
	var	bd = {
		x: B.x - b.x,
		y: B.y - b.y,
	};
	var	det = ( bd.y * ad.x ) - ( bd.x * ad.y );
	var	d = {
		x: a.x - b.x,
		y: a.y - b.y,
	};
	var	n1 = ( ( bd.x * d.y ) - ( bd.y * d.x ) ) / det;
	var	n2 = ( ( ad.x * d.y ) - ( ad.y * d.x ) ) / det;
	return {
		x: a.x + ( n1 * ad.x ), // x = b.x + ( n2 *  bd.x);
		y: a.y + ( n1 * ad.y ), // y = b.x + ( n2 *  bd.y );
		a: n1 > 0 && n1 < 1,
		b: n2 > 0 && n2 < 1,
	};
};

var sortPoints = function ( start, finish, points ) {
};

// function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
// 	var denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
// 	if (denominator == 0) {
// 		return false;
// 	}
// 	var a = line1StartY - line2StartY;
// 	var b = line1StartX - line2StartX;
// 	var n1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b) / denominator;
// 	var n2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b) / denominator;
// 	return {
// 		x: line1StartX + (n1 * (line1EndX - line1StartX)), //line2StartX + (n2 * (line2EndX - line2StartX)),
// 		y: line1StartY + (n1 * (line1EndY - line1StartY)), //line2StartX + (n2 * (line2EndY - line2StartY)),
// 		a: n1 > 0 && n1 < 1,
// 		b: n2 > 0 && n2 < 1,
// 	};
// };