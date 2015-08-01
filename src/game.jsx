// TODO(tom): Click a node to go back to that state
// TODO(tom): Variables/flags/branching
// TODO(tom): Final score/badges/etc.?
// TODO(tom): Use actual KA avatar if available?

var React = require("react");
var Nodes = require("./nodes.jsx");

var stateStore = null;

var StateStore = function(tree, component) {

    this.advanceToNextNode = function(inst, nextNode, delay) {
        var currentInst = tree[this.state.activeNode];
        if (!currentInst) {
            // TODO(tom) Handle error?
            return;
        }

        if (currentInst !== inst) {
            // TODO(tom) Handle error?
            return;
        }
        
        if (!currentInst.nextNodes[nextNode]) {
            // TODO(tom) Handle error?
            return;
        }

        if (this.currentTimeout) {
            return;
        }

        if (delay > 0) {
            this.currentTimeout = window.setTimeout(function() {
                this.currentTimeout = null;
                this.advanceToNextNode(inst, nextNode, 0);
            }.bind(this), 1000 * delay);
            return;
        }

        this.state.activeNode = currentInst.nextNodes[nextNode];
        this.animateOpen();

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
        this.animateOpen();

        this.saveSession();

        this.listenerComponent.forceUpdate();
    };

    this.restartGame = function() {
        this.state = {
            activeNode: ["START", 1],
            choices: {}
        };
        this.animateOpen();
        this.saveSession();

        this.listenerComponent.forceUpdate();
    };

    this.animateOpen = function() {
        this.activeNodeVisible = false;
        window.setTimeout(function() {
            this.activeNodeVisible = true;
            this.listenerComponent.forceUpdate();
        }.bind(this), 50);
    };

    this.saveSession = function() {
        sessionStorage.gameState = JSON.stringify(this.state);
    };

    this.getTimeOfDay = function() {
        var currentInst = tree[this.state.activeNode];
        while (currentInst) {
            if (currentInst.nodeType === "Transition") {
                return currentInst.node.timeOfDay;
            }
            currentInst = tree[currentInst.parentInst];
        }
        return "morning";
    };

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

    this.listenerComponent = component;
    this.currentTimeout = null;
    this.animateOpen();
};

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
                restartCallback: function() {
                    stateStore.restartGame();
                },
                nextNode: (idx > 0 ? instsToRender[idx - 1] : null),
                getParent: function(inst, context) {
                    return getInstanceParent(inst, context);
                }
            }, []);
            var nodeCls = nodeClass.prototype.getClassName(el.props);
            var liCls = "";
            if (idx == 0 && !stateStore.activeNodeVisible) {
                liCls = "closed";
            }
            var key = instsToRender.length - idx;
            outputElements.push(
                <li key={key} className={liCls}>
                  <div className={"arrow " + nodeCls}></div>
                  <div className={"bubble " + nodeCls}>{el}</div>
                  <div className={"avatar " + nodeCls}></div>
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

var ReportView = React.createClass({
    render: function() {
        var instsToRender = [];
        var scores = [];
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
            node = idx > 0 ? instsToRender[idx - 1].id : null;
            console.log(node);
            scores = scores.concat(this.props.report[node] ? this.props.report[node]: [])
        }
        console.log(scores);
        return <div className="report-body" id="report-body">
            <div className="report-container">{scores}</div>
        </div>;
    },
});


var GameView = React.createClass({
    render: function() {
        if (!stateStore) {
            stateStore = new StateStore(this.props.tree, this);
        }

        var timeOfDay = stateStore.getTimeOfDay();
        return <div className={"game-window " + timeOfDay}>
            <div className="sky-bg" />
            <div className="ground-bg">
                <div className="heading">
                    <div className="title">Probability Panic!</div>
                    <div className="credits">by Eli Feasley and Tom Yedwab. &copy; 2015 Khan Academy</div>
                    <div className="instructions">
                        <p><a onClick={stateStore.restartGame.bind(stateStore)}>Start over</a></p>
                        <p>More instructions here...</p>
                    </div>
                </div>
            </div>
        // <ReportView tree={this.props.tree}
        //     report={this.props.report}
        //     activeNode={stateStore.state.activeNode}/>
        <div className="game-window">
            <div className="chat-window">
                <div className="chat-header">
                    <div className="button btn1"></div>
                    <div className="button btn2"></div>
                    <div className="button btn3"></div>
                    <div className="title">Chat with Jesse</div>
                </div>
                <ChatView tree={this.props.tree}
                    activeNode={stateStore.state.activeNode}
                    advanceCallback={stateStore.advanceToNextNode.bind(stateStore)}
                    saveAndReturnCallback={stateStore.saveAndReturn.bind(stateStore)}
                    />
            </div>
        </div>
        </div>;
    }
});

module.exports = GameView;

