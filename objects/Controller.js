
var Controller = {
    styles: {
        // col-resize copy crosshair grab help move pointer progress wait
        'loading': 'wait',
        'newElement': 'cell',
        'linking': 'alias',
        'deleteUniversal': 'not-allowed',
        'default': 'crosshair',
        'toggleShape': 'row-resize',
        'toggleStyle': 'row-resize',
        'resize': 'all-scroll',
        'grab': 'grab',
        'drop': 'grabbing'
    },
    _pos: {
        x: 0,
        y: 0
    },
    _lastPos: {
        x: 0,
        y: 0
    },
    pos: function ( arg ) {
        if ( typeof arg != 'undefined' ) {
            with ( this ) {
                _lastPos.x = _pos.x;
                _lastPos.y = _pos.y;
                _pos.x = arg.x;
                _pos.y = arg.y;
            }
        } else {
            return this._pos;
        }
    },
    keys: {
        Control: false,
        Shift: false,
        Alt: false
    },
    hover: null,
    free: true,
    resizes: null,
    linksTo: null,
    linksFrom: null,
    text: false,
    stage: null,
    state: 'default'
}

