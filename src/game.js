// TODO(tom): Click a node to go back to that state
// TODO(tom): Variables/flags/branching
// TODO(tom): Final score/badges/etc.?
// TODO(tom): Use actual KA avatar if available?
// TODO(tom): Nicer-looking fonts
// TODO(eli): Add a wait in between days
// TODO(eli): Add animations
// TODO(eli): Add to ka.org

(function() {
    var React = require("../lib/react-0.13.3.js");
    var GAME_TREE = require("../build/final_tree.js");
    var Nodes = require("../build/nodes.js");

    var stateStore = new (function(tree) {
        var snapshot = sessionStorage.gameState;
        if (snapshot) {
            this.state = JSON.parse(snapshot);
        }

        if (!snapshot || !tree[this.state.activeNode]) {
            // Reset state
            this.state = {
                activeNode: ["START", 1],
                choices: {}
            };
        }

        this.listenerComponent = null;
        this.registerComponent = function(component) {
            this.listenerComponent = component;
        };

        this.advanceToNextNode = function(nextNode) {
            var currentInst = tree[this.state.activeNode];
            if (!currentInst) {
                // TODO(tom) Handle error?
                return;
            }

            this.state.activeNode = currentInst.nextNodes[nextNode];
            this.saveSession();

            this.listenerComponent.forceUpdate();
        };

        this.saveAndReturn = function(choiceNode) {
            // Jump back to the last choice node and add this terminal node to
            // the list of visited nodes
            var lastChoiceInst = tree[this.state.activeNode];
            if (!lastChoiceInst) {
                // TODO(tom) Handle error?
                return;
            }

            while (lastChoiceInst) {
                if (lastChoiceInst.id === choiceNode) {
                    break;
                }
                lastChoiceInst = tree[lastChoiceInst.parentInst];
            }
            if (!lastChoiceInst) {
                // TODO(tom) Handle error?
                return;
            }

            this.state.choices[lastChoiceInst.id] = (
                this.state.choices[lastChoiceInst.id] || []);
            this.state.choices[lastChoiceInst.id].push(this.state.activeNode);

            this.state.activeNode = [
                lastChoiceInst.id, lastChoiceInst.instNum];

            this.saveSession();

            this.listenerComponent.forceUpdate();
        };

        this.restartGame = function() {
            this.state = {
                activeNode: ["START", 1],
                choices: {}
            };
            this.saveSession();

            this.listenerComponent.forceUpdate();
        };

        this.saveSession = function() {
            sessionStorage.gameState = JSON.stringify(this.state);
        };
    })(GAME_TREE);

    // For debugging
    window.stateStore = stateStore;

    var ChatView = React.createClass({
        render: function() {
            var instsToRender = [];
            var outputElements = [];
            var currentInst = this.props.tree[this.props.activeNode];
            if (!currentInst) {
                return <div>ERROR: Cannot find active node!</div>;
            }

            // Traverse up the tree back to the START node
            var context = {};
            while (currentInst) {
                instsToRender.push(currentInst);
                currentInst = this.getInstanceParent(currentInst, context);
            }

            // Render in reverse order (from START to activeNode)
            for (var idx = instsToRender.length - 1; idx >= 0; idx -= 1) {
                var nodeClass = Nodes[instsToRender[idx].nodeType];
                var viewClass = nodeClass.prototype.View;
                var getInstanceParent = this.getInstanceParent;
                var el = viewClass({
                    tree: this.props.tree,
                    inst: instsToRender[idx],
                    node: instsToRender[idx].node,
                    advanceCallback: this.props.advanceCallback,
                    saveAndReturnCallback: this.props.saveAndReturnCallback,
                    nextNode: (idx > 0 ? instsToRender[idx - 1] : null),
                    getParent: function(inst, context) {
                        return getInstanceParent(inst, context);
                    }
                }, []);
                var cls = nodeClass.prototype.getClassName(el.props);
                outputElements.push(
                    <li key={instsToRender[idx].node.id}>
                      <div className={"arrow " + cls}></div>
                      <div className={"bubble " + cls}>{el}</div>
                      <div className={"avatar " + cls}></div>
                    </li>);
            }

            return <div className="chat-body" id="chat-body">
                <div className="chat-aligner"></div>
                <ol className="chat-container">{outputElements}</ol>
            </div>;
        },

        // Utility function to walk up the instance tree
        getInstanceParent: function(inst, context) {
            if (stateStore.state.choices[inst.id]) {
                // If we're at a choice node, we may have some terminal nodes
                // to visit before going back up the parent.
                var index = (
                    (context[inst.id] !== undefined) ?
                    context[inst.id] - 1 :
                    (stateStore.state.choices[inst.id].length - 1));
                if (index >= 0) {
                    context[inst.id] = index;
                    return this.props.tree[
                        stateStore.state.choices[inst.id][index]];
                }
            }
            return this.props.tree[inst.parentInst];
        },

        // Force the chat to scroll to the bottom
        scrollToBottom: function() {
            var chatBody = React.findDOMNode(this);
            chatBody.scrollTop = 100000;
        },

        componentDidMount: function() {
            this.scrollToBottom();
        },

        componentDidUpdate: function() {
            this.scrollToBottom();
        }
    });

    var GameView = React.createClass({
        componentDidMount: function() {
            stateStore.registerComponent(this);
        },

        render: function() {
            return <div className="game-window">
                <div className="chat-window">
                    <div className="chat-header">
                        <div className="button btn1"></div>
                        <div className="button btn2"></div>
                        <div className="button btn3"></div>
                        <div className="title">Chat with Jesse</div>
                    </div>
                    <ChatView tree={this.props.tree}
                        activeNode={stateStore.state.activeNode}
                        advanceCallback={function(nextNode) {
                            stateStore.advanceToNextNode(nextNode);
                        }}
                        saveAndReturnCallback={function(choiceNode) {
                            stateStore.saveAndReturn(choiceNode);
                        }} />
                </div>
            </div>;
        }
    });

    React.render(
        <GameView tree={GAME_TREE} />,
        document.getElementById('content')
    );
})();
