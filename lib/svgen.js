
var svgen = {
	line: function ( V1, V2 ) {
		return 'M ' + V1.x + ',' + V1.y + ' L ' + V2.x + ',' + V2.y + ' ';
	},
	qcurve: function ( V1, V2, V3 ) {
		return 'M ' + V1.x + ',' + V1.y + ' Q ' + V2.x + ',' + V2.y + ' ' + V3.x + ',' + V3.y + ' ';
	},
	ccurve: function ( V1, V2, V3, V4 ) {
		return 'M ' + V1.x + ',' + V1.y + ' C ' + V2.x + ',' + V2.y + ' ' + V3.x + ',' + V3.y + ' ' + V4.x + ',' + V4.y + ' ';
	}
};