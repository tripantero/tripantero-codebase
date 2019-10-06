$_mod.def("/marko$4.18.14/src/runtime/components/dom-data", function(require, exports, module, __filename, __dirname) { var counter = 0;
var seed = require.resolve('/marko$4.18.14/src/runtime/components/dom-data'/*"./dom-data"*/);
var WeakMap =
    global.WeakMap ||
    function WeakMap() {
        var id = seed + counter++;
        return {
            get: function(ref) {
                return ref[id];
            },
            set: function(ref, value) {
                ref[id] = value;
            }
        };
    };

module.exports = {
    ___vPropsByDOMNode: new WeakMap(),
    ___vElementByDOMNode: new WeakMap(),
    ___componentByDOMNode: new WeakMap(),
    ___detachedByDOMNode: new WeakMap(),
    ___keyByDOMNode: new WeakMap()
};

});