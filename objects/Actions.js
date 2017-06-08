
/*
Acts = {
	generalMovement: Act(),
	blockMovement: Act(),
	pickBlock: Act(),
	resizeBlock: Act(),
	releaseHold: Act(),
	releaseOverBlock: Act(),
	makeLink: Act(),
	toggleStyle: Act(),
	blockCreationStart: Act(),
	blockCreationFinish: Act(),
	// keys
	controlKeyHold: Act(),
	controlKeyRelease: Act()
};
*/

Acts = {
	generalMovement: null,
	blockMovement: null,
	pickBlock: null,
	resizeBlock: null,
	releaseHold: null,
	releaseOverBlock: null,
	makeLink: null,
	toggleStyle: null,
	blockCreationStart: null,
	blockCreationFinish: null,
	// forms
	finishEdit: null,
	// keys
	controlKeyHold: null,
	controlKeyRelease: null,
	escape: null
};

/*
All this deuce is to be able to log out what act was fired,
but in the end problem that forced me to do this was with chrome...
I'm still going to leave it like that for awhile.
*/

(function () {
	var Act = function ( name ) {
		return function act ( arg ) {
			//console.log( name );
			Ctx( Acts[name], arg );
		}
	}
	for ( var i in Acts ) {
		Acts[i] = Act(i);
	}
})()
