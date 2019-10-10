$_mod.def("/marko$4.18.14/src/runtime/components/Component", function(require, exports, module, __filename, __dirname) { "use strict";
/* jshint newcap:false */

var complain = "MARKO_DEBUG" && require('/complain$1.6.0/index'/*"complain"*/);

var domInsert = require('/marko$4.18.14/src/runtime/dom-insert'/*"../dom-insert"*/);
var defaultCreateOut = require('/marko$4.18.14/src/runtime/createOut'/*"../createOut"*/);
var getComponentsContext = require('/marko$4.18.14/src/runtime/components/ComponentsContext'/*"./ComponentsContext"*/)
    .___getComponentsContext;
var componentsUtil = require('/marko$4.18.14/src/runtime/components/util-browser'/*"./util"*/);
var componentLookup = componentsUtil.___componentLookup;
var emitLifecycleEvent = componentsUtil.___emitLifecycleEvent;
var destroyNodeRecursive = componentsUtil.___destroyNodeRecursive;
var EventEmitter = require('/events-light$1.0.5/src/index'/*"events-light"*/);
var RenderResult = require('/marko$4.18.14/src/runtime/RenderResult'/*"../RenderResult"*/);
var SubscriptionTracker = require('/listener-tracker$2.0.0/lib/listener-tracker'/*"listener-tracker"*/);
var inherit = require('/raptor-util$3.2.0/inherit'/*"raptor-util/inherit"*/);
var updateManager = require('/marko$4.18.14/src/runtime/components/update-manager'/*"./update-manager"*/);
var morphdom = require('/marko$4.18.14/src/runtime/vdom/morphdom/index'/*"../vdom/morphdom"*/);
var eventDelegation = require('/marko$4.18.14/src/runtime/components/event-delegation'/*"./event-delegation"*/);
var domData = require('/marko$4.18.14/src/runtime/components/dom-data'/*"./dom-data"*/);
var componentsByDOMNode = domData.___componentByDOMNode;
var CONTEXT_KEY = "__subtree_context__";

var slice = Array.prototype.slice;

var COMPONENT_SUBSCRIBE_TO_OPTIONS;
var NON_COMPONENT_SUBSCRIBE_TO_OPTIONS = {
    addDestroyListener: false
};

var emit = EventEmitter.prototype.emit;
var ELEMENT_NODE = 1;

function removeListener(removeEventListenerHandle) {
    removeEventListenerHandle();
}

function walkFragments(fragment) {
    var node;

    while (fragment) {
        node = fragment.firstChild;

        if (!node) {
            break;
        }

        fragment = node.fragment;
    }

    return node;
}

function handleCustomEventWithMethodListener(
    component,
    targetMethodName,
    args,
    extraArgs
) {
    // Remove the "eventType" argument
    args.push(component);

    if (extraArgs) {
        args = extraArgs.concat(args);
    }

    var targetComponent = componentLookup[component.___scope];
    var targetMethod =
        typeof targetMethodName === "function"
            ? targetMethodName
            : targetComponent[targetMethodName];
    if (!targetMethod) {
        throw Error("Method not found: " + targetMethodName);
    }

    targetMethod.apply(targetComponent, args);
}

function resolveKeyHelper(key, index) {
    return index ? key + "_" + index : key;
}

function resolveComponentIdHelper(component, key, index) {
    return component.id + "-" + resolveKeyHelper(key, index);
}

/**
 * This method is used to process "update_<stateName>" handler functions.
 * If all of the modified state properties have a user provided update handler
 * then a rerender will be bypassed and, instead, the DOM will be updated
 * looping over and invoking the custom update handlers.
 * @return {boolean} Returns true if if the DOM was updated. False, otherwise.
 */
function processUpdateHandlers(component, stateChanges, oldState) {
    var handlerMethod;
    var handlers;

    for (var propName in stateChanges) {
        if (stateChanges.hasOwnProperty(propName)) {
            var handlerMethodName = "update_" + propName;

            handlerMethod = component[handlerMethodName];
            if (handlerMethod) {
                (handlers || (handlers = [])).push([propName, handlerMethod]);
            } else {
                // This state change does not have a state handler so return false
                // to force a rerender
                return;
            }
        }
    }

    // If we got here then all of the changed state properties have
    // an update handler or there are no state properties that actually
    // changed.
    if (handlers) {
        // Otherwise, there are handlers for all of the changed properties
        // so apply the updates using those handlers

        handlers.forEach(function(handler) {
            var propertyName = handler[0];
            handlerMethod = handler[1];

            var newValue = stateChanges[propertyName];
            var oldValue = oldState[propertyName];
            handlerMethod.call(component, newValue, oldValue);
        });

        emitLifecycleEvent(component, "update");

        component.___reset();
    }

    return true;
}

function checkInputChanged(existingComponent, oldInput, newInput) {
    if (oldInput != newInput) {
        if (oldInput == null || newInput == null) {
            return true;
        }

        var oldKeys = Object.keys(oldInput);
        var newKeys = Object.keys(newInput);
        var len = oldKeys.length;
        if (len !== newKeys.length) {
            return true;
        }

        for (var i = 0; i < len; i++) {
            var key = oldKeys[i];
            if (oldInput[key] !== newInput[key]) {
                return true;
            }
        }
    }

    return false;
}

var componentProto;

/**
 * Base component type.
 *
 * NOTE: Any methods that are prefixed with an underscore should be considered private!
 */
function Component(id) {
    EventEmitter.call(this);
    this.id = id;
    this.___state = null;
    this.___rootNode = null;
    this.___subscriptions = null;
    this.___domEventListenerHandles = null;
    this.___bubblingDomEvents = null; // Used to keep track of bubbling DOM events for components rendered on the server
    this.___customEvents = null;
    this.___scope = null;
    this.___renderInput = null;
    this.___input = undefined;
    this.___mounted = false;
    this.___global = undefined;

    this.___destroyed = false;
    this.___updateQueued = false;
    this.___dirty = false;
    this.___settingInput = false;

    this.___document = undefined;

    this.___keyedElements = {};
    this.___keySequence = undefined;
}

Component.prototype = componentProto = {
    ___isComponent: true,

    subscribeTo: function(target) {
        if (!target) {
            throw TypeError();
        }

        var subscriptions =
            this.___subscriptions ||
            (this.___subscriptions = new SubscriptionTracker());

        var subscribeToOptions = target.___isComponent
            ? COMPONENT_SUBSCRIBE_TO_OPTIONS
            : NON_COMPONENT_SUBSCRIBE_TO_OPTIONS;

        return subscriptions.subscribeTo(target, subscribeToOptions);
    },

    emit: function(eventType) {
        var customEvents = this.___customEvents;
        var target;

        if (customEvents && (target = customEvents[eventType])) {
            var targetMethodName = target[0];
            var isOnce = target[1];
            var extraArgs = target[2];
            var args = slice.call(arguments, 1);

            handleCustomEventWithMethodListener(
                this,
                targetMethodName,
                args,
                extraArgs
            );

            if (isOnce) {
                delete customEvents[eventType];
            }
        }

        if (this.listenerCount(eventType)) {
            return emit.apply(this, arguments);
        }
    },
    getElId: function(key, index) {
        return resolveComponentIdHelper(this, key, index);
    },
    getEl: function(key, index) {
        if (key) {
            var resolvedKey = resolveKeyHelper(key, index);
            var keyedElement = this.___keyedElements["@" + resolvedKey];

            if (!keyedElement) {
                var keyedComponent = this.getComponent(resolvedKey);

                if (keyedComponent) {
                    // eslint-disable-next-line no-constant-condition
                    if ("MARKO_DEBUG") {
                        complain(
                            "Accessing the elements of a child component using 'component.getEl' is deprecated."
                        );
                    }

                    return walkFragments(keyedComponent.___rootNode);
                }
            }

            return keyedElement;
        } else {
            return this.el;
        }
    },
    getEls: function(key) {
        key = key + "[]";

        var els = [];
        var i = 0;
        var el;
        while ((el = this.getEl(key, i))) {
            els.push(el);
            i++;
        }
        return els;
    },
    getComponent: function(key, index) {
        var rootNode = this.___keyedElements[resolveKeyHelper(key, index)];
        if (/\[\]$/.test(key)) {
            // eslint-disable-next-line no-constant-condition
            if ("MARKO_DEBUG") {
                complain(
                    "A repeated key[] was passed to getComponent. Use a non-repeating key if there is only one of these components."
                );
            }
            rootNode = rootNode && rootNode[Object.keys(rootNode)[0]];
        }
        return rootNode && componentsByDOMNode.get(rootNode);
    },
    getComponents: function(key) {
        var lookup = this.___keyedElements[key + "[]"];
        return lookup
            ? Object.keys(lookup)
                  .map(function(key) {
                      return componentsByDOMNode.get(lookup[key]);
                  })
                  .filter(Boolean)
            : [];
    },
    destroy: function() {
        if (this.___destroyed) {
            return;
        }

        var root = this.___rootNode;

        this.___destroyShallow();

        var nodes = root.nodes;

        nodes.forEach(function(node) {
            destroyNodeRecursive(node);

            if (eventDelegation.___handleNodeDetach(node) !== false) {
                node.parentNode.removeChild(node);
            }
        });

        root.detached = true;

        delete componentLookup[this.id];
        this.___keyedElements = {};
    },

    ___destroyShallow: function() {
        if (this.___destroyed) {
            return;
        }

        emitLifecycleEvent(this, "destroy");
        this.___destroyed = true;

        componentsByDOMNode.set(this.___rootNode, undefined);

        this.___rootNode = null;

        // Unsubscribe from all DOM events
        this.___removeDOMEventListeners();

        var subscriptions = this.___subscriptions;
        if (subscriptions) {
            subscriptions.removeAllListeners();
            this.___subscriptions = null;
        }
    },

    isDestroyed: function() {
        return this.___destroyed;
    },
    get state() {
        return this.___state;
    },
    set state(newState) {
        var state = this.___state;
        if (!state && !newState) {
            return;
        }

        if (!state) {
            state = this.___state = new this.___State(this);
        }

        state.___replace(newState || {});

        if (state.___dirty) {
            this.___queueUpdate();
        }

        if (!newState) {
            this.___state = null;
        }
    },
    setState: function(name, value) {
        var state = this.___state;

        if (typeof name == "object") {
            // Merge in the new state with the old state
            var newState = name;
            for (var k in newState) {
                if (newState.hasOwnProperty(k)) {
                    state.___set(k, newState[k], true /* ensure:true */);
                }
            }
        } else {
            state.___set(name, value, true /* ensure:true */);
        }
    },

    setStateDirty: function(name, value) {
        var state = this.___state;

        if (arguments.length == 1) {
            value = state[name];
        }

        state.___set(
            name,
            value,
            true /* ensure:true */,
            true /* forceDirty:true */
        );
    },

    replaceState: function(newState) {
        this.___state.___replace(newState);
    },

    get input() {
        return this.___input;
    },
    set input(newInput) {
        if (this.___settingInput) {
            this.___input = newInput;
        } else {
            this.___setInput(newInput);
        }
    },

    ___setInput: function(newInput, onInput, out) {
        onInput = onInput || this.onInput;
        var updatedInput;

        var oldInput = this.___input;
        this.___input = undefined;
        this.___context = (out && out[CONTEXT_KEY]) || this.___context;

        if (onInput) {
            // We need to set a flag to preview `this.input = foo` inside
            // onInput causing infinite recursion
            this.___settingInput = true;
            updatedInput = onInput.call(this, newInput || {}, out);
            this.___settingInput = false;
        }

        newInput = this.___renderInput = updatedInput || newInput;

        if ((this.___dirty = checkInputChanged(this, oldInput, newInput))) {
            this.___queueUpdate();
        }

        if (this.___input === undefined) {
            this.___input = newInput;
            if (newInput && newInput.$global) {
                this.___global = newInput.$global;
            }
        }

        return newInput;
    },

    forceUpdate: function() {
        this.___dirty = true;
        this.___queueUpdate();
    },

    ___queueUpdate: function() {
        if (!this.___updateQueued) {
            this.___updateQueued = true;
            updateManager.___queueComponentUpdate(this);
        }
    },

    update: function() {
        if (this.___destroyed === true || this.___isDirty === false) {
            return;
        }

        var input = this.___input;
        var state = this.___state;

        if (
            this.___dirty === false &&
            state !== null &&
            state.___dirty === true
        ) {
            if (
                processUpdateHandlers(
                    this,
                    state.___changes,
                    state.___old,
                    state
                )
            ) {
                state.___dirty = false;
            }
        }

        if (this.___isDirty === true) {
            // The UI component is still dirty after process state handlers
            // then we should rerender

            if (this.shouldUpdate(input, state) !== false) {
                this.___scheduleRerender();
            }
        }

        this.___reset();
    },

    get ___isDirty() {
        return (
            this.___dirty === true ||
            (this.___state !== null && this.___state.___dirty === true)
        );
    },

    ___reset: function() {
        this.___dirty = false;
        this.___updateQueued = false;
        this.___renderInput = null;
        var state = this.___state;
        if (state) {
            state.___reset();
        }
    },

    shouldUpdate: function() {
        return true;
    },

    ___emitLifecycleEvent: function(eventType, eventArg1, eventArg2) {
        emitLifecycleEvent(this, eventType, eventArg1, eventArg2);
    },

    ___scheduleRerender: function() {
        var self = this;
        var renderer = self.___renderer;

        if (!renderer) {
            throw TypeError();
        }

        var input = this.___renderInput || this.___input;

        updateManager.___batchUpdate(function() {
            self.___rerender(input, false).afterInsert(self.___document);
        });

        this.___reset();
    },

    ___rerender: function(input, isHydrate) {
        var doc = this.___document;
        var globalData = this.___global;
        var rootNode = this.___rootNode;
        var renderer = this.___renderer;
        var createOut = renderer.createOut || defaultCreateOut;
        var out = createOut(globalData);
        out.sync();
        out.___document = this.___document;
        out[CONTEXT_KEY] = this.___context;

        var componentsContext = getComponentsContext(out);
        var globalComponentsContext = componentsContext.___globalContext;
        globalComponentsContext.___rerenderComponent = this;
        globalComponentsContext.___isHydrate = isHydrate;

        renderer(input, out);

        var result = new RenderResult(out);

        var targetNode = out.___getOutput().___firstChild;

        morphdom(rootNode, targetNode, doc, componentsContext);

        return result;
    },

    ___detach: function() {
        var root = this.___rootNode;
        root.remove();
        return root;
    },

    ___removeDOMEventListeners: function() {
        var eventListenerHandles = this.___domEventListenerHandles;
        if (eventListenerHandles) {
            eventListenerHandles.forEach(removeListener);
            this.___domEventListenerHandles = null;
        }
    },

    get ___rawState() {
        var state = this.___state;
        return state && state.___raw;
    },

    ___setCustomEvents: function(customEvents, scope) {
        var finalCustomEvents = (this.___customEvents = {});
        this.___scope = scope;

        customEvents.forEach(function(customEvent) {
            var eventType = customEvent[0];
            var targetMethodName = customEvent[1];
            var isOnce = customEvent[2];
            var extraArgs = customEvent[3];

            finalCustomEvents[eventType] = [
                targetMethodName,
                isOnce,
                extraArgs
            ];
        });
    },

    get el() {
        return walkFragments(this.___rootNode);
    },

    get els() {
        // eslint-disable-next-line no-constant-condition
        if ("MARKO_DEBUG") {
            complain(
                'The "this.els" attribute is deprecated. Please use "this.getEls(key)" instead.'
            );
        }
        return (this.___rootNode ? this.___rootNode.nodes : []).filter(function(
            el
        ) {
            return el.nodeType === ELEMENT_NODE;
        });
    }
};

componentProto.elId = componentProto.getElId;
componentProto.___update = componentProto.update;
componentProto.___destroy = componentProto.destroy;

// Add all of the following DOM methods to Component.prototype:
// - appendTo(referenceEl)
// - replace(referenceEl)
// - replaceChildrenOf(referenceEl)
// - insertBefore(referenceEl)
// - insertAfter(referenceEl)
// - prependTo(referenceEl)
domInsert(
    componentProto,
    function getEl(component) {
        return component.___detach();
    },
    function afterInsert(component) {
        return component;
    }
);

inherit(Component, EventEmitter);

module.exports = Component;

});