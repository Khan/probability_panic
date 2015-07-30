window.GAME_TREE = Nodes.instantiateTree({
    "START": new Nodes.RecvText(
        "Hello! Can you help me with my math homework?",
        "CHOICE"),
    "CHOICE": new Nodes.SendChoice([
            {label: "Yes", nextNode: "GREAT"},
            {label: "No", nextNode: "THANKS"}
        ]),
    "GREAT": new Nodes.RecvText(
        "Great! Thank you so much!",
        "END"),
    "THANKS": new Nodes.RecvText(
        "OK. Thanks anyway.",
        "END"),
    "END": new Nodes.GameOver()
});

