var React = require("../lib/react-0.13.3.js");
(function() {

    var GameOverNode = function() {};

    GameOverNode.prototype.type = "GameOver";

    GameOverNode.prototype.getClassName = function() { return "info"; };

    GameOverNode.prototype.getNextNodes = function() { return {}; };

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

    RecvTextNode.prototype.getClassName = function(props) {
        return props.node.className;
    };

    RecvTextNode.prototype.getNextNodes = function() {
        return {"NEXT": this.nextId};
    };

    RecvTextNode.prototype.View = React.createFactory(React.createClass({
        render: function() {
            return <div>{this.props.node.text}</div>;
        },

        componentDidMount: function() {
            // If we're the currently active node, wait the desired number of
            // seconds and then automatically advance
            if (this.props.nextNode === null) {
                window.setTimeout(function() {
                    this.props.advanceCallback("NEXT");
                }.bind(this), 1000 * this.props.node.nextTime);
            }
        }
    }));

    var SendTextNode = function(text, nextId, className, nextTime) {
        this.text = text;
        this.nextId = nextId;
        this.className = className || "right";
        // Next time defaults to 1 second
        this.nextTime = (nextTime === undefined) ? 1 : nextTime;
    };

    SendTextNode.prototype = Object.create(RecvTextNode.prototype, {})

    RecvImageNode = function(src, nextId, className, nextTime) {
        this.src = src;
        this.nextId = nextId;
        this.className = className || "left";
        // Next time defaults to 1 second
        this.nextTime = (nextTime === undefined) ? 1 : nextTime;
    };

    RecvImageNode.prototype.type = "RecvImage";

    RecvImageNode.prototype.getClassName = function(props) {
        return props.node.className;
    };

    RecvImageNode.prototype.getNextNodes = function() {
        return {"NEXT": this.nextId};
    };

    RecvImageNode.prototype.View = React.createFactory(React.createClass({
        render: function() {
            return <div><img src={this.props.node.src} width={300} /></div>;
        },

        componentDidMount: function() {
            // If we're the currently active node, wait the desired number of
            // seconds and then automatically advance
            if (this.props.nextNode === null) {
                window.setTimeout(function() {
                    this.props.advanceCallback("NEXT");
                }.bind(this), 1000 * this.props.node.nextTime);
            }
        }
    }));

    SendImageNode = function(src, nextId, className, nextTime) {
        this.src = src;
        this.nextId = nextId;
        this.className = className || "right";
        // Next time defaults to 1 second
        this.nextTime = (nextTime === undefined) ? 1 : nextTime;
    };

    SendImageNode.prototype = Object.create(RecvImageNode.prototype, {})

    var SendChoiceNode = function(choices) {
        // List of choice objects. Each choice looks like:
        // { label: "...", nextNode: "..." }
        this.choices = choices;
    };

    SendChoiceNode.prototype.type = "SendChoice";

    SendChoiceNode.prototype.getClassName = function(props) {
        return (props.nextNode !== null) ? "right" : "choice";
    };

    SendChoiceNode.prototype.getNextNodes = function(id, parentList) {
        var nextNodes = {};
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
                nextNodes[idx] = this.choices[idx].nextNode;
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
                var context = {};
                var parentInst = this.props.getParent(
                    this.props.inst, context);
                var parentNextId = null;
                var found = false;
                while (parentInst) {
                    if (parentInst.id === this.props.inst.id &&
                        parentNextId === choice.nextNode) {
                        found = true;
                        break;
                    }

                    parentNextId = parentInst.id;
                    parentInst = this.props.getParent(parentInst, context);
                }
                if (found) {
                    continue;
                }

                validChoices.push([idx, choice]);
            }
            return validChoices;
        },

        render: function() {
            var idx;

            if (this.props.nextNode) {
                // Find the choice that corresponds to the next node
                for (idx = 0; idx < this.props.node.choices.length; idx++) {
                    if (this.props.inst.nextNodes[idx] &&
                        (this.props.inst.nextNodes[idx][0] ===
                         this.props.nextNode.id) &&
                        (this.props.inst.nextNodes[idx][1] ===
                         this.props.nextNode.instNum)) {
                        return <div>{this.props.node.choices[idx].label}</div>;
                    }
                }
                    
                // TODO(tom): Handle this error condition better?
                return <div>???</div>;
            }

            var choiceElements = [];
            var validChoices = this.getValidChoices();

            if (validChoices.length === 1) {
                // Don't display a button if there's a single option.
                return <div>{validChoices[0][1].label}</div>;
            }

            for (var idx = 0; idx < validChoices.length; idx++) {
                var choice = validChoices[idx][1];

                var cb = (function(cb, next) {
                    return function() { cb(next); };
                })(this.props.advanceCallback, validChoices[idx][0]);

                choiceElements.push(
                    <button onClick={cb} key={idx}>{choice.label}</button>);
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
                    this.props.advanceCallback(validChoices[0][0]);
                }.bind(this), 1000);
            }
        }
    }));

    // A special node that returns the user back to their last SendChoice node
    // while remembering the history of their choices
    var ReturnToChoiceNode = function(choiceNode) {
        this.choiceNode = choiceNode;
    };
    ReturnToChoiceNode.prototype.type = "ReturnToChoice";
    ReturnToChoiceNode.prototype.getClassName = function() {
        return "hidden";
    };
    ReturnToChoiceNode.prototype.getNextNodes = function() { return {}; };
    ReturnToChoiceNode.prototype.View = React.createFactory(React.createClass({
        render: function() {
            return <div />;
        },

        componentDidMount: function() {
            // Send a special message to jump to the last choice node
            this.props.saveAndReturnCallback(this.props.node.choiceNode);
        }
    }));

    module.exports = {
        GameOver: GameOverNode,
        RecvText: RecvTextNode,
        SendText: SendTextNode,
        RecvImage: RecvImageNode,
        SendImage: SendImageNode,
        SendChoice: SendChoiceNode,
        ReturnToChoice: ReturnToChoiceNode
    };
})();
