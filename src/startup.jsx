var React = require("react");
var GameView = require("./game.js");
var GameTree = require("./final_tree.js");
React.render(
    React.createElement(GameView, {tree: GameTree}, []),
    document.getElementById('gameContent'));

