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


var Report = function(nodes_visited) {
	var notifications = [];
	var scores = []
	var class_type = "chat-window email "
	class_type += nodes_visited.indexOf("Have a great time at rehearsal!") <= 0 ? 'hidden' : '';
	for (var idx = 0; idx < nodes_visited.length; idx += 1) {
		scores = scores.concat(NODE_TYPES[nodes_visited[idx]] ? NODE_TYPES[nodes_visited[idx]]: []);
	}

    return <div className={class_type}>
                <div className="report-header">
                                <div className="title">Subject: Nice Job, Jesse! A-</div>
                            </div><div className="chat-body report-body" id="report-body">
        <div className="chat-container report-container">
        <img src="/images/labs/quiz.jpg" width="300"/>
        <p>
        Well done, Jesse! You got a score of A- on your probability test!
        </p>

        <p>
        You showed a lot of growth mindset this week! You know that doing well comes from
        working hard, not built-in smarts.
        That helps a lot with doing well. You worked really hard!
        </p>

        <p>
        Spreading out your studies over the whole week was helpful for learning the materiel!
        </p>

        <p>
        I noticed you studied one probability topic per day this week. In the future, you might
        want to try studying different topics on different days - this is called mixing your practice,
        and it helps you learn more.
        </p>

        <p>
        Finally, it looks like you have a tutor who cares about you and pays attention
        to what's going on in your life! Having a mentor who cares and is invested is
        a major key to success!
        </p>

        <p> Write your own letter to Jesse:
        	<a href="https://www.khanacademy.org/computer-programming/write-jesse-a-letter/5241985746206720">here</a>
        </p>
        </div>
    </div>
    </div>;
}

module.exports = Report;