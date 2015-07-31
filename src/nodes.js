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

    SendChoiceNode.prototype.getNextNodes = function(id, parentList) {
        var nextNodes = [];
        for (var idx = 0; idx < this.choices.length; idx++) {
            var found = false;
            for (var parentIdx = 0; parentIdx < parentList.length;
                    parentIdx++) {
                if (parentList[parentIdx][0] === id &&
                    parentIdx < parentList.length - 1 &&
                    parentList[parentIdx+1][0] ===
                        this.choices[idx].nextNode) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                nextNodes.push(this.choices[idx].nextNode);
            }
        };
        return nextNodes;
    }

    SendChoiceNode.prototype.View = React.createFactory(React.createClass({
        getValidChoices: function() {
            var validChoices = [];
            for (idx = 0; idx < this.props.node.choices.length; idx++) {
                var choice = this.props.node.choices[idx];
                
                // Has the user already selected this choice?
                var parentInst = this.props.inst.parent;
                var parentNextId = null;
                var found = false;
                while (parentInst) {
                    if (parentInst.id === this.props.inst.id &&
                        parentNextId === choice.nextNode) {
                        found = true;
                        break;
                    }

                    parentNextId = parentInst.id;
                    parentInst = parentInst.parent;
                }
                if (found) {
                    continue;
                }

                validChoices.push(choice);
            }
            return validChoices;
        },

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
            var validChoices = this.getValidChoices();

            for (var idx = 0; idx < validChoices.length; idx++) {
                var choice = validChoices[idx];

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
        },

        componentDidMount: function() {
            // If there is only one valid choice (the others have already
            // been selected) then just advance automatically
            var validChoices = this.getValidChoices();
            if (validChoices.length === 1) {
                this.props.advanceCallback(validChoices[0].nextNode);
            }
        }
    }));

    // Create a unique instance of a node in the output pool
    var _instantiateNode = function(id, parentList, nodeTree, outputPool) {
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
            parent: outputPool[parentList[parentList.length - 1]],
            nextNodes: {},
        };

        // Recurse with each of the next nodes, creating a unique instance for
        // each one
        var nextNodes = node.getNextNodes(id, parentList);
        for (var idx = 0; idx < nextNodes.length; idx++) {
            var newParentList = parentList.slice();
            newParentList.push([id, instanceNum])

            var nextInstanceId = _instantiateNode(
                nextNodes[idx], newParentList, nodeTree, outputPool);

            outputPool[[id, instanceNum]].nextNodes[nextNodes[idx]] = (
                    nextInstanceId);
        }

        return [id, instanceNum];
    };

    // Create unique instances for the entire tree of nodes, starting at
    // the START node and traversing down
    var instantiateTree = function(nodeTree) {
        var outputPool = {};
        _instantiateNode("START", [], nodeTree, outputPool);
        return outputPool;
    };

    window.Nodes = {
        GameOver: GameOverNode,
        RecvText: RecvTextNode,
        SendChoice: SendChoiceNode,

        instantiateTree: instantiateTree
    };
})();
