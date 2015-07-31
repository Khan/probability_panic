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
        this.state = {
            activeNode: (sessionStorage.activeNode ? 
                         sessionStorage.activeNode.split(":") : ["START", 1])
        };

        this.listenerComponent = null;
        this.registerComponent = function(component) {
            this.listenerComponent = component;
        };

        this.advanceToNextNode = function(nextNode) {
            var currentInst = tree[this.state.activeNode];
            if (!currentInst) {
                return;
            }

            this.state.activeNode = currentInst.nextNodes[nextNode];
            sessionStorage.activeNode = this.state.activeNode.join(":");

            this.listenerComponent.forceUpdate();
        };
    })(GAME_TREE);

    var ChatView = React.createClass({
        render: function() {
            var instsToRender = [];
            var outputElements = [];
            var currentInst = this.props.tree[this.props.activeNode];
            if (!currentInst) {
                return <div>ERROR: Cannot find active node!</div>;
            }

            // Traverse up the tree back to the START node
            while (currentInst) {
                instsToRender.push(currentInst);
                currentInst = this.props.tree[currentInst.parentInst];
            }

            // Render in reverse order (from START to activeNode)
            for (var idx = instsToRender.length - 1; idx >= 0; idx -= 1) {
                var nodeClass = Nodes[instsToRender[idx].nodeType];
                var viewClass = nodeClass.prototype.View;
                var el = viewClass({
                    tree: this.props.tree,
                    inst: instsToRender[idx],
                    node: instsToRender[idx].node,
                    advanceCallback: this.props.advanceCallback,
                    nextNode: (idx > 0 ? instsToRender[idx - 1] : null)
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

        scrollToBottom: function() {
            // Force the chat to scroll to the bottom
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
