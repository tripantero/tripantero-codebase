$_mod.def("/marko$4.18.14/src/runtime/components/beginComponent-browser", function(require, exports, module, __filename, __dirname) { var ComponentDef = require('/marko$4.18.14/src/runtime/components/ComponentDef'/*"./ComponentDef"*/);

module.exports = function beginComponent(
    componentsContext,
    component,
    key,
    ownerComponentDef
) {
    var componentId = component.id;

    var globalContext = componentsContext.___globalContext;
    var componentDef = (componentsContext.___componentDef = new ComponentDef(
        component,
        componentId,
        globalContext
    ));
    globalContext.___renderedComponentsById[componentId] = true;
    componentsContext.___components.push(componentDef);

    var out = componentsContext.___out;
    out.bc(component, key, ownerComponentDef && ownerComponentDef.___component);
    return componentDef;
};

});