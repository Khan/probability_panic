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
            var instsToRender = [];
            var outputElements = [];
            var currentInst = this.props.tree[this.state.activeNode];
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
                    advanceCallback: this.advanceToNextNode,
                    nextNode: (idx > 0 ? instsToRender[idx - 1].id : null)
                }, []);
                outputElements.push(
                    <li key={instsToRender[idx].node.id}>{el}</li>);
            }

            return <ol>{outputElements}</ol>;
        },

        advanceToNextNode: function(nextNode) {
            var currentInst = this.props.tree[this.state.activeNode];
            if (!currentInst) {
                return;
            }

            this.setState({
                activeNode: currentInst.nextNodes[nextNode]
            });
        }
    });

    React.render(
        <GameView tree={GAME_TREE} />,
        document.getElementById('content')
    );
})();
