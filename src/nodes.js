var React = require("../lib/react-0.13.3.js");
(function() {

    var GameOverNode = function() {};

    GameOverNode.prototype.type = "GameOver";

    GameOverNode.prototype.getClassName = function() { return "info"; };

    GameOverNode.prototype.getNextNodes = function() { return []; };

    GameOverNode.prototype.View = React.createFactory(React.createClass({
        render: function() {
            return <div>Game over</div>;
        }
    }));

    var RecvTextNode = function(text, nextId, className, nextTime) {
        this.text = text;
        this.nextId = nextId;
        this.className = className || "left";
        // Next time defaults to 1 second
        this.nextTime = (nextTime === undefined) ? 1 : nextTime;
    };

    RecvTextNode.prototype.type = "RecvText";

    RecvTextNode.prototype.getClassName = function() {
        return this.className;
    };

    RecvTextNode.prototype.getNextNodes = function() { return [this.nextId]; };

    RecvTextNode.prototype.View = React.createFactory(React.createClass({
        render: function() {
            return <div>{this.props.node.text}</div>;
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

    SendChoiceNode.prototype.type = "SendChoice";

    SendChoiceNode.prototype.getClassName = function(props) {
        return props.nextNode ? "right" : "choice";
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
                        return <div>{choice.label}</div>;
                    }
                }
                    
                // TODO(tom): Handle this error condition better?
                return <div>???</div>;
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
                choiceElements.push(<br />);
            }

            return <div>
                {choiceElements}
            </div>;
        },

        componentDidMount: function() {
            if (this.props.nextNode) {
                return;
            }

            // If there is only one valid choice (the others have already
            // been selected) then just advance automatically after one second
            var validChoices = this.getValidChoices();
            if (validChoices.length === 1) {
                window.setTimeout(function() {
                    this.props.advanceCallback(validChoices[0].nextNode);
                }.bind(this), 1000);
            }
        }
    }));

    module.exports = {
        GameOver: GameOverNode,
        RecvText: RecvTextNode,
        SendChoice: SendChoiceNode
    };
})();
