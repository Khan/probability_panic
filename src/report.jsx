// Being at some nodes means that the player has just done something
// mean or nice or promoting of growth mindset or w/e.
// We want to be able to count this stuff at the end of the game so we
// keep track of which nodes caused what states here.
var NODE_TYPES = {
    "I'm disappointed in you. You must not be applying yourself enough.": ["MEAN"],
    "Wah, wah. You don’t hear me complaining about how hard Calculus is.": ["MEAN"],
    "School treating you ok?": ["NICE"],
    "Have you been doing anything for fun?": ["NICE"],
    "How's the city?": ["NICE"],
    "What kind of homework?": ["NICE"],
    "But you're smart, you were always good at math.": ["FIXED_MINDSET"],
    "It's hard for everyone. Keep working at it and eventually you’ll get it!": ["GROWTH_MINDSET"],
}



var Report = function(points) {
	var notifications = [];
}

module.exports = NODE_TYPES;