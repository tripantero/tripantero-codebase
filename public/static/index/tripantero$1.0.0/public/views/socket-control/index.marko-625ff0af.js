$_mod.def("/tripantero$1.0.0/public/views/socket-control/index.marko", function(require, exports, module, __filename, __dirname) { // Compiled using marko@4.18.14 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require('/marko$4.18.14/src/vdom'/*"marko/src/vdom"*/).t(),
    marko_component = {
    onMount: function () {
        let scriptLoader = path => {
            let script = document.createElement('script');
            script.src = path;
            script.type = 'text/javascript';
            document.getElementsByTagName('head')[0].appendChild(script);
        };
        scriptLoader('/js/socket.io.js');
        scriptLoader('/js/socket.event.js');
    }
},
    components_helpers = require('/marko$4.18.14/src/runtime/components/helpers-browser'/*"marko/src/runtime/components/helpers"*/),
    marko_registerComponent = components_helpers.rc,
    marko_componentType = marko_registerComponent("/tripantero$1.0.0/public/views/socket-control/index.marko", function() {
      return module.exports;
    }),
    marko_renderer = components_helpers.r,
    marko_defineComponent = components_helpers.c,
    marko_helpers = require('/marko$4.18.14/src/runtime/vdom/helpers'/*"marko/src/runtime/vdom/helpers"*/),
    marko_createElement = marko_helpers.e,
    marko_const = marko_helpers.const,
    marko_const_nextId = marko_const("b55943"),
    marko_node0 = marko_createElement("div", null, "0", null, 0, 0, {
        i: marko_const_nextId()
      });

function render(input, out, __component, component, state) {
  var data = input;

  out.n(marko_node0, component);
}

marko_template._ = marko_renderer(render, {
    ___type: marko_componentType
  }, marko_component);

marko_template.Component = marko_defineComponent(marko_component, marko_template._);

});