$_mod.def("/marko$4.18.14/dist/runtime/components/dom-data", function(require, exports, module, __filename, __dirname) { var counter = 0;
var seed = require.resolve('/marko$4.18.14/dist/runtime/components/dom-data'/*"./dom-data"*/);
var WeakMap = global.WeakMap || function WeakMap() {
    var id = seed + counter++;
    return {
        get: function (ref) {
            return ref[id];
        },
        set: function (ref, value) {
            ref[id] = value;
        }
    };
};

module.exports = {
    _Y_: new WeakMap(),
    _Z_: new WeakMap(),
    G_: new WeakMap(),
    a__: new WeakMap(),
    aa_: new WeakMap()
};
});