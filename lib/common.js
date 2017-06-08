
/*
	some global common use functions for work with DOM etc
*/

function getById ( arg ) {
	return typeof this !== undefined && isDOM( this ) && this !== window ?
	this.getElementById( arg ) :
	document.getElementById( arg )
}

function getByClass ( arg ) {
	return typeof this !== undefined && isDOM( this ) && this !== window ?
	this.getElementsByClassName( arg ) :
	document.getElementsByClassName( arg )
}

function isDOMNode ( arg ) {
	return (
		typeof Node === "object" ?
		arg instanceof Node : 
		arg && typeof arg === "object" && typeof arg.nodeType === "number" && typeof arg.nodeName === "string"
	);
}

function isDOMElement ( arg ) {
	return (
		typeof HTMLElement === "object" ?
		arg instanceof HTMLElement :
		arg && typeof arg === "object" && arg !== null && arg.nodeType === 1 && typeof arg.nodeName === "string"
	);
}

function isDOM ( arg ) {
	return isDOMNode( arg ) || isDOMElement( arg )
}

function isObject ( arg ) {
	return typeof arg === 'object' && arg !== null
}

function isDefined ( arg ) {
	return typeof arg != typeof undefined;
}

function isUndefined ( arg ) {
	return typeof arg == typeof undefined;
}

function isNull ( arg ) {
	return arg === null; // checking types to differ from undefined
}

function isNumber ( arg ) {
	return typeof ( arg ) == typeof 0;
}
