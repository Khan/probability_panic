(function() {
    var GameOverNode = function() {};

    GameOverNode.prototype.getNextNodes = function() { return []; };

    GameOverNode.prototype.View = React.createFactory(React.createClass({
        render: function() {
            return <div>Game over!</div>;
        }
    }));

    var RecvTextNode = function(text, nextId, nextTime) {
        this.text = text;
        this.nextId = nextId;
        // Next time defaults to 1 second
        this.nextTime = nextTime || 1;
    };

    RecvTextNode.prototype.getNextNodes = function() { return [this.nextId]; };

    RecvTextNode.prototype.View = React.createFactory(React.createClass({
        render: function() {
            return <div>STUDENT: {this.props.node.text}</div>;
        },

        componentDidMount: function() {
            // If we're the currently active node, wait the desired number of
            // seconds and then automatically advance
            if (this.props.nextNode === null) {
                window.setTimeout(function() {
                    this.props.advanceCallback(this.props.node.nextId);
                }.bind(this), 1000 * this.props.node.nextTime);
            }
        }
    }));

    var SendChoiceNode = function(choices) {
        // List of choice objects. Each choice looks like:
        // { label: "...", nextNode: "..." }
        this.choices = choices;
    };

    SendChoiceNode.prototype.getNextNodes = function() {
        // TODO(tom) - Need to handle this better if we have the same
        // next node twice
        var nextNodes = [];
        for (var idx = 0; idx < this.choices.length; idx++) {
            nextNodes.push(this.choices[idx].nextNode);
        };
        return nextNodes;
    }

    SendChoiceNode.prototype.View = React.createFactory(React.createClass({
        render: function() {
            var idx;

            if (this.props.nextNode) {
                // Find the choice that corresponds to the next node
                for (idx = 0; idx < this.props.node.choices.length; idx++) {
                    var choice = this.props.node.choices[idx];
                    if (choice.nextNode === this.props.nextNode) {
                        return <div>YOU: {choice.label}</div>;
                    }
                }
                    
                // TODO(tom): Handle this error condition better?
                return <div>YOU: ???</div>;
            }

            var choiceElements = [];
            for (idx = 0; idx < this.props.node.choices.length; idx++) {
                var choice = this.props.node.choices[idx];
                var cb = (function(cb, next) {
                    return function() { cb(next); };
                })(this.props.advanceCallback, choice.nextNode);
                choiceElements.push(
                    <button onClick={cb} key={choice.nextNode}>
                        {choice.label}
                    </button>);
            }

            return <div>
                {choiceElements}
            </div>;
        }
    }));

    // Create a unique instance of a node in the output pool
    var _instantiateNode = function(id, parentInst, nodeTree, outputPool) {
        var node = nodeTree[id];

        // Find an available instance # for this node
        var instanceNum = 1;
        while (outputPool[[id, instanceNum]] !== undefined) {
            instanceNum += 1;
        }

        // Create the new instance
        outputPool[[id, instanceNum]] = {
            id: id,
            node: node,
            parentInst: parentInst,
            nextNodes: {},
        };

        // Recurse with each of the next nodes, creating a unique instance for
        // each one
        var nextNodes = node.getNextNodes();
        for (var idx = 0; idx < nextNodes.length; idx++) {
            var nextInstanceId = _instantiateNode(
                nextNodes[idx], [id, instanceNum], nodeTree, outputPool);

            outputPool[[id, instanceNum]].nextNodes[nextNodes[idx]] = (
                    nextInstanceId);
        }

        return [id, instanceNum];
    };

    // Create unique instances for the entire tree of nodes, starting at
    // the START node and traversing down
    var instantiateTree = function(nodeTree) {
        var outputPool = {};
        _instantiateNode("START", null, nodeTree, outputPool);
        return outputPool;
    };

    window.Nodes = {
        GameOver: GameOverNode,
        RecvText: RecvTextNode,
        SendChoice: SendChoiceNode,

        instantiateTree: instantiateTree
    };
})();
