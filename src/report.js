// Being at some nodes means that the player has just done something
// mean or nice or promoting of growth mindset or w/e.
// We want to be able to count this stuff at the end of the game so we
// keep track of which nodes caused what states here.
var NODE_TYPES = {
    "MON.HOMEWORK.OFFENDEDa": ["MEAN"],
    "MON.HOMEWORK.OFFENDEDb": ["MEAN"],
    "MON.SCHOOL": ["NICE"],
    "MON.FUN": ["NICE"],
    "MON.CITY": ["NICE"],
    "MON.HOMEWORK": ["NICE"],
    "MON.HOMEWORK.ELABORATEa": ["FIXED_MINDSET"],
    "MON.HOMEWORK.ELABORATEb": ["GROWTH_MINDSET"],
}



var Report = function(points) {
	var notifications = [];
}


module.exports = NODE_TYPES;