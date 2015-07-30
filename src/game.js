// TODO(tom): Snapshot state at choice points
// TODO(tom): Click a node to go back to that state
// TODO(tom): Variables/flags/branching
// TODO(tom): Final score/badges/etc.?

(function() {
    var GameView = React.createClass({
        getInitialState: function() {
            return {
                activeNode: ["START",1]
            };
        },

        render: function() {
            var nodesToRender = [];
            var outputElements = [];
            var currentNode = this.props.tree[this.state.activeNode];
            if (!currentNode) {
                return <div>ERROR: Cannot find active node!</div>;
            }

            // Traverse up the tree back to the START node
            while (currentNode) {
                nodesToRender.push(currentNode);
                currentNode = this.props.tree[currentNode.parentInst];
            }

            // Render in reverse order (from START to activeNode)
            for (var idx = nodesToRender.length - 1; idx >= 0; idx -= 1) {
                var el = nodesToRender[idx].node.View({
                    node: nodesToRender[idx].node,
                    advanceCallback: this.advanceToNextNode,
                    nextNode: (idx > 0 ? nodesToRender[idx - 1].id : null)
                }, []);
                outputElements.push(
                    <li key={nodesToRender[idx].node.id}>{el}</li>);
            }

            return <ol>{outputElements}</ol>;
        },

        advanceToNextNode: function(nextNode) {
            var currentNode = this.props.tree[this.state.activeNode];
            if (!currentNode) {
                return;
            }

            this.setState({
                activeNode: currentNode.nextNodes[nextNode]
            });
        }
    });

    React.render(
        <GameView tree={GAME_TREE} />,
        document.getElementById('content')
    );
})();
