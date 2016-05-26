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

var makeClass = function ( name, constructor, properties ) {
	name = constructor;
	for ( var property in properties ) {
		name[ property ] = properties[ property ];
	}
	name.prototype = name;
	return name;
};

var Class = function ( args ) {
	var	constructor = args.constructor,
		static = args.static,
		prototype = args.prototype || Object.prototype;

	
//	constructor.prototype = prototype;

	for ( var property in static ) {
		this[ property ] = static[ property ];
	}

	return constructor;
};

var isObject = function ( arg ) {
	if ( (typeof A === "object") && (A !== null) ) {
		return false;
	}
	return true;
}
