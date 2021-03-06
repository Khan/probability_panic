var React = require("react");

(function() {
    var _defaultDelay = 3;

    var _autoAdvance = function() {
        // If we're the currently active node, wait the desired number of
        // seconds and then automatically advance
        if (this.props.nextNode === null) {
            this.props.advanceCallback(this.props.inst, "NEXT", this.props.node.delay);
        }
    };
    var AutoAdvanceMixin = function(classDef) {
        var oldComponentDidMount = classDef.componentDidMount;
        classDef.componentDidMount = function() {
            _autoAdvance.call(this);
            if (oldComponentDidMount) {
                oldComponentDidMount();
            }
        };

        var oldComponentDidUpdate = classDef.componentDidUpdate;
        classDef.componentDidUpdate = function() {
            _autoAdvance.call(this);
            if (oldComponentDidUpdate) {
                oldComponentDidUpdate();
            }
        };

        return classDef;
    };

    var GameOverNode = function() {};

    GameOverNode.prototype.type = "GameOver";

    GameOverNode.prototype.getClassName = function() { return "info"; };

    GameOverNode.prototype.getNextNodes = function() { return {}; };

    GameOverNode.prototype.View = React.createFactory(React.createClass({
        render: function() {
            return <div>
                <div>Game over</div>
                <button onClick={this.props.restartCallback}
                        className="play-again">
                    Play again
                </button>
            </div>;
        }
    }));

    var RecvTextNode = function(text, nextId, className, delay) {
        this.text = text;
        this.nextId = nextId;
        this.className = className || "left";
        // This is a heuristic, but let's give the players 12 characters/sec
        // to read
        this.delay = (delay === undefined) ? (text.length / 12.0) : delay;
    };

    RecvTextNode.prototype.type = "RecvText";

    RecvTextNode.prototype.getClassName = function(props) {
        return props.node.className;
    };

    RecvTextNode.prototype.getNextNodes = function() {
        return {"NEXT": this.nextId};
    };

    RecvTextNode.prototype.View = React.createFactory(React.createClass(
        AutoAdvanceMixin({
            render: function() {
                return <div>{this.props.node.text}</div>;
            },
        })));

    var SendTextNode = function(text, nextId, className, delay) {
        this.text = text;
        this.nextId = nextId;
        this.className = className || "right";
        // This is a heuristic, but let's give the players 12 characters/sec
        // to read
        this.delay = (delay === undefined) ? (text.length / 12.0) : delay;
    };

    SendTextNode.prototype = Object.create(RecvTextNode.prototype, {})

    RecvImageNode = function(src, nextId, className, delay) {
        this.src = src;
        this.nextId = nextId;
        this.className = className || "left";
        this.delay = (delay === undefined) ? _defaultDelay : delay;
    };

    RecvImageNode.prototype.type = "RecvImage";

    RecvImageNode.prototype.getClassName = function(props) {
        return props.node.className;
    };

    RecvImageNode.prototype.getNextNodes = function() {
        return {"NEXT": this.nextId};
    };

    RecvImageNode.prototype.View = React.createFactory(React.createClass(
        AutoAdvanceMixin({
            render: function() {
                return <div><img src={this.props.node.src} width={300} /></div>;
            },
        })));

    SendImageNode = function(src, nextId, className, delay) {
        this.src = src;
        this.nextId = nextId;
        this.className = className || "right";
        this.delay = (delay === undefined) ? _defaultDelay : delay;
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
                var curNode = this.props.inst;

                var cb = (function(cb, next) {
                    return function() { cb(curNode, next, 0); };
                })(this.props.advanceCallback, validChoices[idx][0]);

                choiceElements.push(
                    <button onClick={cb} key={idx}>{choice.label}</button>);
                choiceElements.push(<br key={idx + "B"} />);
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
                this.props.advanceCallback(this.props.inst, validChoices[0][0], _defaultDelay);
            }
        },

        componentDidUpdate: function() {
            this.componentDidMount();
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
            if (this.props.nextNode === null) {
                this.props.saveAndReturnCallback(this.props.node.choiceNode);
            }
        }
    }));

    var TransitionNode = function(timeOfDay, nextId, delay) {
        this.timeOfDay = timeOfDay;
        this.nextId = nextId;
        this.delay = delay;
    };
    TransitionNode.prototype.type = "Transition";
    TransitionNode.prototype.getClassName = function() {
        return "hidden";
    };
    TransitionNode.prototype.getNextNodes = function() {
        return {"NEXT": this.nextId};
    };
    TransitionNode.prototype.View = React.createFactory(React.createClass(
        AutoAdvanceMixin({
            render: function() {
                return <div />;
            }
        })));

    module.exports = {
        GameOver: GameOverNode,
        RecvText: RecvTextNode,
        SendText: SendTextNode,
        RecvImage: RecvImageNode,
        SendImage: SendImageNode,
        SendChoice: SendChoiceNode,
        ReturnToChoice: ReturnToChoiceNode,
        Transition: TransitionNode
    };
})();
