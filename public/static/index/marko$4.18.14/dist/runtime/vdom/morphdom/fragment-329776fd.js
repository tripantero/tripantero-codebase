$_mod.def("/marko$4.18.14/dist/runtime/vdom/morphdom/fragment", function(require, exports, module, __filename, __dirname) { var helpers = require('/marko$4.18.14/dist/runtime/vdom/morphdom/helpers'/*"./helpers"*/);
var insertBefore = helpers.aH_;

var fragmentPrototype = {
    nodeType: 12,
    get firstChild() {
        var firstChild = this.startNode.nextSibling;
        return firstChild === this.endNode ? undefined : firstChild;
    },
    get lastChild() {
        var lastChild = this.endNode.previousSibling;
        return lastChild === this.startNode ? undefined : lastChild;
    },
    get parentNode() {
        var parentNode = this.startNode.parentNode;
        return parentNode === this.detachedContainer ? undefined : parentNode;
    },
    get namespaceURI() {
        return this.startNode.parentNode.namespaceURI;
    },
    get nextSibling() {
        return this.endNode.nextSibling;
    },
    get nodes() {
        var nodes = [];
        var current = this.startNode;
        while (current !== this.endNode) {
            nodes.push(current);
            current = current.nextSibling;
        }
        nodes.push(current);
        return nodes;
    },
    insertBefore: function (newChildNode, referenceNode) {
        var actualReference = referenceNode == null ? this.endNode : referenceNode;
        return insertBefore(newChildNode, actualReference, this.startNode.parentNode);
    },
    insertInto: function (newParentNode, referenceNode) {
        this.nodes.forEach(function (node) {
            insertBefore(node, referenceNode, newParentNode);
        }, this);
        return this;
    },
    remove: function () {
        this.nodes.forEach(function (node) {
            this.detachedContainer.appendChild(node);
        }, this);
    }
};

function createFragmentNode(startNode, nextNode, parentNode) {
    var fragment = Object.create(fragmentPrototype);
    fragment.startNode = document.createTextNode("");
    fragment.endNode = document.createTextNode("");
    fragment.startNode.fragment = fragment;
    fragment.endNode.fragment = fragment;
    var detachedContainer = fragment.detachedContainer = document.createDocumentFragment();
    parentNode = parentNode || startNode && startNode.parentNode || detachedContainer;
    insertBefore(fragment.startNode, startNode, parentNode);
    insertBefore(fragment.endNode, nextNode, parentNode);
    return fragment;
}

function beginFragmentNode(startNode, parentNode) {
    var fragment = createFragmentNode(startNode, null, parentNode);
    fragment.bO_ = function (nextNode) {
        fragment.bO_ = null;
        insertBefore(fragment.endNode, nextNode, parentNode || startNode.parentNode);
    };
    return fragment;
}

exports.ai_ = createFragmentNode;
exports.bP_ = beginFragmentNode;
});