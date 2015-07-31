var Nodes = require("../build/nodes.js");
var GAME_TREE = {
    "START": new Nodes.RecvText(
        "6:32pm", "NEXT", "info", 0),
    "NEXT": new Nodes.RecvText(
        "Hello! Can you help me with my math homework?",
        "CHOICE"),
    "CHOICE": new Nodes.SendChoice([
            {label: "Yes", nextNode: "GREAT"},
            {label: "Maybe", nextNode: "CHOICE.MAYBE"},
            {label: "No", nextNode: "CHOICE.NO"}
        ]),
    "CHOICE.RETURN": new Nodes.ReturnToChoice("CHOICE"),
    "GREAT": new Nodes.RecvText(
        "Great! Thank you so much!",
        "END"),
    "CHOICE.MAYBE": new Nodes.RecvText(
        "Will you do it for a snickers bar?",
        "CHOICE.2"),
    "CHOICE.NO": new Nodes.RecvText(
        "Are you sure?",
        "CHOICE.RETURN"),
    "CHOICE.2": new Nodes.SendChoice([
        {label: "No I won't do it for a snickers bar.", nextNode: "END"},
        {label: "I might do it for a snickers bar.", nextNode: "CHOICE.RETURN"}
    ]),
    "END": new Nodes.GameOver()
};
module.exports = GAME_TREE;
