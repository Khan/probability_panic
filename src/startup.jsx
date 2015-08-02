var React = require("react");
var GameView = require("./game.js");
var Report = require("./report.js");
var GameTree = require("./final_tree.js");
React.render(
    React.createElement(GameView, {tree: GameTree, report: Report}, []),
    document.getElementById('gameContent'));