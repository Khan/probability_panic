// TODO(tom): Snapshot state at choice points
// TODO(tom): Click a node to go back to that state
// TODO(tom): Variables/flags/branching
// TODO(tom): Final score/badges/etc.?
// TODO(tom): Use actual KA avatar if available?

(function() {
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
                currentInst = currentInst.parent;
            }

            // Render in reverse order (from START to activeNode)
            for (var idx = instsToRender.length - 1; idx >= 0; idx -= 1) {
                var el = instsToRender[idx].node.View({
                    inst: instsToRender[idx],
                    node: instsToRender[idx].node,
                    advanceCallback: this.props.advanceCallback,
                    nextNode: (idx > 0 ? instsToRender[idx - 1].id : null)
                }, []);
                var cls = instsToRender[idx].node.getClassName(el.props);
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

        componentDidUpdate: function() {
            // Force the chat to scroll to the bottom
            var chatBody = React.findDOMNode(this);
            chatBody.scrollTop = 100000;

        }
    });

    var GameView = React.createClass({
        getInitialState: function() {
            return {
                activeNode: ["START",1]
            };
        },

        advanceToNextNode: function(nextNode) {
            var currentInst = this.props.tree[this.state.activeNode];
            if (!currentInst) {
                return;
            }

            this.setState({
                activeNode: currentInst.nextNodes[nextNode]
            });
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
                        activeNode={this.state.activeNode}
                        advanceCallback={this.advanceToNextNode} />
                </div>
            </div>;
        }
    });

    React.render(
        <GameView tree={GAME_TREE} />,
        document.getElementById('content')
    );
})();
