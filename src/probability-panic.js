var Nodes = require("../build/nodes.js");

var GAME_TREE = {

    "START": new Nodes.Transition(
        "afternoon", "MON.START", 0),

    "MON.START": new Nodes.RecvText(
        "Monday, 5:43 PM",
        "MON.START.HELLO",
        "info", 0),

    // Jesse says hi
    "MON.START.HELLO": new Nodes.RecvText(
        "Hey, cousin! 😊",
        "MON.START.RESPONSE"),

    // Say hi back to Jesse
    "MON.START.RESPONSE": new Nodes.SendText(
        "Hey, Jesse! What've you been us to since the move?",
        "MON.JESSE.NEW"),

    // Jesse's update on life
    "MON.JESSE.NEW": new Nodes.RecvText(
        "Not too much. :)",
        "MON.JESSE.NEW1"),

    "MON.JESSE.NEW1": new Nodes.RecvText(
        "I miss you and the family.",
        "MON.JESSE.NEW2"),

    "MON.JESSE.NEW2": new Nodes.RecvText(
        "Things are sort of rough. I already have homework. 😞",
        "MON.CONVERSATION.CHOICE"),

    // Conversation loop to ask about Jesse's life
    "MON.CONVERSATION.CHOICE": new Nodes.SendChoice([
            {label: "School treating you ok?", nextNode: "MON.SCHOOL"},
            {label: "Have you been doing anything for fun?", nextNode: "MON.FUN"},
            {label: "How's the city?", nextNode: "MON.CITY"},
            {label: "What kind of homework?", nextNode: "MON.HOMEWORK"},
            {label: "I'll let you go do homework then. BYE!", nextNode: "MON.END"},
        ]),

    // A node that returns to the choice node above
    "MON.CONVERSATION.CHOICE.RETURN": new Nodes.ReturnToChoice("MON.CONVERSATION.CHOICE"),

    /* Conversation about how school's going. */
    // Jesse's first response
    "MON.SCHOOL": new Nodes.RecvText(
        "7th grade is so different! No more recess.",
        "MON.SCHOOL.RESPONSE"),

    // Ask followup question
    "MON.SCHOOL.RESPONSE": new Nodes.SendChoice([
        {label: "Oh no! You’ll have to come back here sometime and play tag with the old crew.",
        nextNode: "MON.SCHOOL1a"},
        {label: "Eh, after a while you won’t miss it.",
        nextNode: "MON.SCHOOL1"}
        ]),

    // Jesse's second response
    "MON.SCHOOL1a": new Nodes.RecvText(
        "I can't wait.",
        "MON.SCHOOL1"),
    "MON.SCHOOL1": new Nodes.RecvText(
        "I feel like people think I'm lame because I'm from Wyoming. They don't even know where it is! For all they know I'm from Nebraska!",
        "MON.SCHOOL.RESPONSE1"),

    // Ask second followup
    "MON.SCHOOL.RESPONSE1": new Nodes.SendChoice([
        {label: "Sounds about right. New Yorkers are SUPER MEAN. Like, the worst.",
        nextNode: "MON.SCHOOL2"},
        {label: "Oh no! Can I help? Things were really hard for me when I first moved here.",
        nextNode: "MON.SCHOOL2a"}
        ]),



    // Jesse's last response
    "MON.SCHOOL2": new Nodes.RecvText(
        "I’ll be ok. Nothing will be as bad as that time Brian Anderson put salamanders in my sandwich in third grade. And I lived through that. Unlike the salamanders.",
        "MON.SCHOOL.RESPONSE3a"),
    "MON.SCHOOL2a": new Nodes.RecvText(
        "Thanks, that means a lot.",
        "MON.SCHOOL2"),


    // Wrap up conversation and redirect to choices
    "MON.SCHOOL.RESPONSE3a": new Nodes.SendText(
            "Well, good. Stay strong",
            "MON.SCHOOL.RESPONSE3b"),

    "MON.SCHOOL.RESPONSE3b": new Nodes.SendText(
            "I’m always here for you, cuz, no matter what.",
            "MON.CONVERSATION.CHOICE.RETURN"),


    /**
      Conversation about fun
    **/
    // Jesse's first response
    "MON.FUN": new Nodes.RecvText(
        "Well, I auditioned for the school play. I really hope I get it!",
        "MON.FUN.RESPONSE"),

    // Ask followup question
    "MON.FUN.RESPONSE": new Nodes.SendChoice([
            {label: "Cool! What play is it going to be?",
            nextNode: "MON.FUN1a"},
            {label: "I thought you preferred reading?",
            nextNode: "MON.FUN1b"},
            ]),

    // Jesse's second response
    "MON.FUN1a": new Nodes.RecvText(
        "We’re actually putting on Alice in Wonderland! I’m really excited - it’s supposed to be really whimsical, and the parts are really fun.",
        "MON.FUN.RESPONSE1"),

    // Jesse's second response
    "MON.FUN1b": new Nodes.RecvText(
        "Well, it's Alice in Wonderland. So it's um literary? I guess?",
        "MON.FUN1b.a"),
    "MON.FUN1b.a": new Nodes.RecvText(
        "Mom says I'm supposed to try to make friends.",
        "MON.FUN.RESPONSE1"),

    // Ask second followup
    "MON.FUN.RESPONSE1": new Nodes.SendText(
        "I love Alice in Wonderland. Have you ever read it?",
        "MON.FUN2a"),

    // Jesse's afraid of cats, apparently
    "MON.FUN2a": new Nodes.RecvText(
        "No, but I’ve been meaning to get around to it! I heard it has cool illustrations?",
        "MON.FUN2b"),
    "MON.FUN2b": new Nodes.RecvText(
        "But that cat has always sort of creeped me out 😒",
        "MON.FUN.RESPONSE3a"),

    // Ask MORE THINGS
    "MON.FUN.RESPONSE3a": new Nodes.SendText(
        "You mean this cat?",
        "MON.FUN.RESPONSE3b"),

    "MON.FUN.RESPONSE3b": new Nodes.SendImage(
            "/images/labs/cheshire-cat.jpg",
            "MON.FUN.RESPONSE3c"),

    "MON.FUN.RESPONSE3c": new Nodes.SendText(
        "What part did you try out for?",
        "MON.FUN3a"),

    // Um apparently not that many parts are gender neutral?
    // Jesse's afraid of cats, apparently
    "MON.FUN3a": new Nodes.RecvText(
        "I actually tried out for the cat.",
        "MON.FUN3b"),
    "MON.FUN3b": new Nodes.RecvText(
        "Fear is the mind killer.",
        "MON.FUN3c"),
    "MON.FUN3c": new Nodes.RecvText(
        "So I'm fighting mine.",
        "MON.FUN.RESPONSE4"),

    // Jesse's a weirdo. Time to wrap this up.
    "MON.FUN.RESPONSE4": new Nodes.SendText(
        "lol",
        "MON.CONVERSATION.CHOICE.RETURN"),


    /**
      Conversation about city
    **/
    // Jesse's first response
    "MON.CITY": new Nodes.RecvText(
        "It's bananas!",
        "MON.CITYb"),
    "MON.CITYb": new Nodes.RecvText(
        "Our new apartment is smaller than your living room!",
        "MON.CITY.RESPONSEa"),

    // Ask followup question
    "MON.CITY.RESPONSEa": new Nodes.SendText(
        "Well, at least you get to be somewhere different, see somewhere new.",
        "MON.CITY.RESPONSEb"),
    "MON.CITY.RESPONSEb": new Nodes.SendText(
        "I can’t wait to move to the city after I finish my senior year.",
        "MON.CITY.RESPONSEc"),
    "MON.CITY.RESPONSEc": new Nodes.SendText(
        "Then we can go back to Monday Movies. Just like the old days.",
        "MON.CITY1"),

    // Jesse's second response
    "MON.CITY1": new Nodes.RecvText(
        "I miss you so much.",
        "MON.CITY.RESPONSE1"),

    // Ask second followup
    "MON.CITY.RESPONSE1": new Nodes.SendText(
        "I miss you too, Jess. It sucks not having my spunky canoe-paddling minion around. I’ve had to switch to kayaking. The horror!",
        "MON.CITY2a"),

    // Jesse's afraid of cats, apparently
    "MON.CITY2a": new Nodes.RecvText(
        "The city stinks almost as bad as your canoe steering abilities 😷.",
        "MON.CITY2b"),
    "MON.CITY2b": new Nodes.RecvText(
        "Kidding, you’re the best. But this city really does smell like … well, we’re nice, so let’s just say it doesn’t smell like fresh grass. At all.",
        "MON.CITY.RESPONSE3a"),

    // Ask MORE THINGS
    "MON.CITY.RESPONSE3a": new Nodes.SendText(
        "Well, I can't wait to visit and you can show me the good stuff, and what smells to avoid.",
        "MON.CONVERSATION.CHOICE.RETURN"),


    /**
      Conversation about math homework
    **/
    // Jesse's first response
    "MON.HOMEWORK": new Nodes.RecvText(
        "We're studying probability.",
        "MON.HOMEWORKb"),
    "MON.HOMEWORKb": new Nodes.RecvText(
        "This stuff is hard, I'm really not getting it.",
        "MON.HOMEWORK.RESPONSE"),

    // Ask followup question
    "MON.HOMEWORK.RESPONSE": new Nodes.SendChoice([
            {label: "But you're smart, you were always good at math.",
            nextNode: "MON.HOMEWORK.ELABORATEa"},
            {label: "It's hard for everyone. Keep working at it and eventually you’ll get it!",
            nextNode: "MON.HOMEWORK.ELABORATEb"},
            {label: "I'm disappointed in you. You must not be applying yourself enough.",
            nextNode: "MON.HOMEWORK.OFFENDEDa"},
            {label: "Wah, wah. You don’t hear me complaining about how hard Calculus is.",
            nextNode: "MON.HOMEWORK.OFFENDEDb"}]),

    "MON.HOMEWORK.ELABORATEa": new Nodes.RecvText(
            "I used to feel like that. Now I'm not so sure.",
            "MON.HOMEWORK.RESPONSE1"),
    "MON.HOMEWORK.ELABORATEb": new Nodes.RecvText(
            "Yeah, I know... It's just super difficult",
            "MON.HOMEWORK.RESPONSE1"),
    "MON.HOMEWORK.OFFENDEDa": new Nodes.RecvText(
            "I try really hard! You're not so perfect!",
            "MON.HOMEWORK.RESPONSE1"),
    "MON.HOMEWORK.OFFENDEDb": new Nodes.RecvText(
            "Hey, since when are you such a jerk?",
            "MON.HOMEWORK.RESPONSE1"),

    // Jesse's second response
    "MON.HOMEWORK.RESPONSE1": new Nodes.SendChoice([
            {label: "Well, PROBABLY you'll get probability. 😜. Get it?",
            nextNode: "MON.CONVERSATION.CHOICE.RETURN"},
            {label: "What part do you not understand?",
            nextNode: "MON.HOMEWORK.ELABORATE1"}]),

    // Ask second followup
    "MON.HOMEWORK.ELABORATE1": new Nodes.RecvText(
            "I don't like all the things with lots of dice...",
            "MON.HOMEWORK.RESPONSE2"),

    // Jesse's afraid of cats, apparently
    "MON.HOMEWORK.RESPONSE2": new Nodes.SendChoice([
            {label: "I see.",
            nextNode: "MON.CONVERSATION.CHOICE.RETURN"},
            {label: "Do you want some help later?",
            nextNode: "MON.HOMEWORK.ACCEPT_HELP"}]),

    "MON.HOMEWORK.ACCEPT_HELP": new Nodes.RecvText(
            "Yeah, I'd love some! Thanks, you're the best",
            "MON.CONVERSATION.CHOICE.RETURN"),

    // Wrap up Monday (currently ends game)
    "MON.END": new Nodes.RecvText(
        "Love you. Talk to you soon!",
        "WED.TRANSITION"),








    // It's Wednesday. Two days have passed.
    "WED.TRANSITION": new Nodes.Transition(
        "morning", "WED.START", 5),

    "WED.START": new Nodes.RecvText(
        "Wednesday, 11:12 AM",
        "WED.START.HELLO",
        "info", 0),

    "WED.START.HELLO": new Nodes.RecvText(
        "Oh no! Trouble is coming my way.",
        "WED.START.RESPONSE"),

    // Say hi back to Jesse
    "WED.START.RESPONSE": new Nodes.SendChoice([
        {label: "I was wondering where you were the past couple days.",
        nextNode: "WED.JESSE.QUIZa"},
        {label: "Oh no! What happened?",
        nextNode: "WED.JESSE.QUIZ"}]),


    "WED.JESSE.QUIZa": new Nodes.RecvText(
        "I've been busy with homework and stuff.",
        "WED.JESSE.QUIZ"),

    "WED.JESSE.QUIZ": new Nodes.RecvText(
        "I just had a probability pop quiz and it was ...",
        "WED.JESSE.QUIZb"),

    "WED.JESSE.QUIZb": new Nodes.RecvText(
        "Awesome would not be the word I would use.",
        "WED.JESSE.QUIZc"),

    "WED.JESSE.QUIZc": new Nodes.RecvText(
        "Maybe... nervewracking? wake-up-calling?",
        "WED.JESSE.QUIZd"),

    "WED.JESSE.QUIZd": new Nodes.RecvText(
        "HOW DO I PROBABILITY?",
        "WED.JESSE.QUIZe"),

    "WED.JESSE.QUIZe": new Nodes.RecvText(
        "I've got to go. I'll be on later tonight.",
        "WED.EVE.TRANSITION"),

    "WED.EVE.TRANSITION": new Nodes.Transition(
        "evening", "WED.EVE.START", 5),

    "WED.EVE.START": new Nodes.RecvText(
        "Wednesday, 9:12 PM",
        "WED.EVE.BACK",
        "info", 0),

    "WED.EVE.BACK": new Nodes.RecvText(
        "I'm back. I'm a bit calmer now.",
        "WED.CALM.JESSE"),

    // Calm your cousin down
    "WED.CALM.JESSE": new Nodes.SendChoice([
        {label: "Do you want some help?.",
        nextNode: "MON.JESSE.0"},
        {label: "That's too bad, you're super annoying",
        nextNode: "MON.JESSE.0"}]),

    "MON.JESSE.0": new Nodes.RecvText(
    "Wow, you mean you're willing to help me? That's amazing!",
    "MON.RESPONSE.0"),

    "MON.RESPONSE.0": new Nodes.SendText(
    "Of course! What's family for? Besides being extremely annoying",
    "MON.RESPONSE.0a"),

    "MON.RESPONSE.0a": new Nodes.SendText(
    "and borrowing your shirts.",
    "MON.RESPONSE.0b"),

    "MON.RESPONSE.0b": new Nodes.SendText(
    "without asking permission",
    "MON.RESPONSE.0c"),

    "MON.RESPONSE.0c": new Nodes.SendText(
    "and wearing those shirts to go mudsliding.",
    "MON.RESPONSE.0d"),

    "MON.RESPONSE.0d": new Nodes.SendText(
    "But besides that, what's family for?",
    "MON.JESSE.1"),

    "MON.JESSE.1": new Nodes.RecvText(
    "Cookies?",
    "MON.RESPONSE.1"),

    "MON.RESPONSE.1": new Nodes.SendText(
    "That too. So, what're you having trouble with?",
    "MON.JESSE.2"),

    "MON.JESSE.2": new Nodes.RecvText(
    "I don't even know where to start. I have this probability quiz.",
    "MON.JESSE.2a"),

    "MON.JESSE.2a": new Nodes.RecvText(
    "But I also have a vocabulary test.",
    "MON.JESSE.2b"),

    "MON.JESSE.2b": new Nodes.RecvText(
    "And all of this physics homework",
    "MON.JESSE.2c"),

    "MON.JESSE.2c": new Nodes.RecvText(
    "And I need to write an essay in Latin.",
    "MON.JESSE.2d"),

    "MON.JESSE.2d": new Nodes.RecvText(
    "And it's all due Friday, and it's already Tuesday!",
    "MON.JESSE.2e"),

    "MON.JESSE.2e": new Nodes.RecvText(
    "Plus, I'm still not finished rewatching every episode of Friends.",
    "MON.RESPONSE.2"),

    "MON.RESPONSE.2": new Nodes.SendText(
    "One thing I find helpful is to mix up my studying, and to do a little in each subject each day.",
    "MON.RESPONSE.2a"),

    "MON.RESPONSE.2a": new Nodes.SendText(
    "So maybe spend like 30 minutes on each subject each of today, tomorrow, and the next day?",
    "MON.JESSE.3"),

    "MON.JESSE.3": new Nodes.RecvText(
    "Hmm, maybe I'll try that.",
    "MON.JESSE.3a"),

    "MON.JESSE.3a": new Nodes.RecvText(
    "There are also all of these different weird chapters and topics in probability.",
    "MON.JESSE.3b"),

    "MON.JESSE.3b": new Nodes.RecvText(
    "Like, some of it is about dice",
    "MON.JESSE.3c"),

    "MON.JESSE.3c": new Nodes.RecvText(
    "And sometimes they want me to memorize equations",
    "MON.JESSE.3d"),

    "MON.JESSE.3d": new Nodes.RecvText(
    "And other times they want me to compare groups of numbers?",
    "MON.JESSE.3e"),

    "MON.JESSE.3e": new Nodes.RecvText(
    "It's a lot.",
    "MON.RESPONSE.3"),

    "MON.RESPONSE.3": new Nodes.SendText(
    "Try doing a few of each kind of problem each day. Spacing things out helps build up how well you remember things. Sleeping on what you learn can help solidify it.",
    "MON.JESSE.4"),

    "MON.JESSE.4": new Nodes.RecvText(
    "OK, fine. I'll try that.",
    "MON.JESSE.4a"),

    "MON.JESSE.4a": new Nodes.RecvText(
    "This is really hard!",
    "MON.JESSE.4b"),

    "MON.JESSE.4b": new Nodes.RecvText(
    "My brain is melting. Literally I think I might wake up with no brain.",
    "MON.JESSE.4c"),

    "MON.JESSE.4c": new Nodes.RecvText(
    "And then I wouldn't have to go to school.",
    "MON.JESSE.4d"),

    "MON.JESSE.4d": new Nodes.RecvText(
    "And then I could wake up at home",
    "MON.JESSE.4e"),

    "MON.JESSE.4e": new Nodes.RecvText(
    "so i guess that's an upside of studying.",
    "MON.RESPONSE.4"),

    "MON.RESPONSE.4": new Nodes.SendText(
    "It’s good to experience hard things. It mean's you're learning!",
    "MON.JESSE.5"),

    "MON.JESSE.5": new Nodes.RecvText(
    "Do you really believe that? It makes me feel dumb. And bad about myself, sometimes.",
    "MON.RESPONSE.5"),

    "MON.RESPONSE.5": new Nodes.SendText(
    "Yeah, I really do.",
    "MON.RESPONSE.5a"),

    "MON.RESPONSE.5a": new Nodes.SendText(
    "When I first tried to learn to play guitar, I really sucked at it. It was super embarrassing.",
    "MON.JESSE.6"),

    "MON.JESSE.6": new Nodes.RecvText(
    "Yeah, you really, really did",
    "MON.RESPONSE.6"),

    "MON.RESPONSE.6": new Nodes.SendText(
    "Thanks.",
    "MON.RESPONSE.6a"),

    "MON.RESPONSE.6a": new Nodes.SendText(
    "Jerk. :P",
    "MON.RESPONSE.6b"),

    "MON.RESPONSE.6b": new Nodes.SendText(
    "As the weeks went on, and turned into months and years, I became totally amazing at guitar",
    "MON.RESPONSE.6c"),

    "MON.RESPONSE.6c": new Nodes.SendText(
    "And now I have this totally awesome band",
    "MON.RESPONSE.6d"),

    "MON.RESPONSE.6d": new Nodes.SendText(
    "The Wily Dreadnoughts",
    "MON.RESPONSE.6e"),

    "MON.RESPONSE.6e": new Nodes.SendText(
    "Which could never have happened without the time of suck.",
    "MON.JESSE.7"),

    "MON.JESSE.7": new Nodes.RecvText(
    "I think you're pretty rockin’, for what it's worth.",
    "MON.JESSE.7a"),

    "MON.JESSE.7a": new Nodes.RecvText(
    "Maybe all of this sucking will pay off down the road",
    "MON.JESSE.7b"),

    "MON.JESSE.7b": new Nodes.RecvText(
    "Who knows",
    "MON.RESPONSE.7"),

    "MON.RESPONSE.7": new Nodes.SendText(
    "It will, don't worry",
    "MON.JESSE.8"),

    "MON.JESSE.8": new Nodes.RecvText(
    "Hey, I just wanted to thank you for your help today.",
    "MON.JESSE.8a"),

    "MON.JESSE.8a": new Nodes.RecvText(
    "It was really helpful. I'm feeling way more optimistic about things!",
    "MON.RESPONSE.8"),

    "MON.RESPONSE.8": new Nodes.SendText(
    "My pleasure!",
    "MON.JESSE.9"),

    "MON.JESSE.9": new Nodes.RecvText(
    "OK, i've been studying for a while now.",
    "MON.JESSE.9a"),

    "MON.JESSE.9a": new Nodes.RecvText(
    "My brain melted and resolidified into a weird crystalline structure",
    "MON.JESSE.9b"),

    "MON.JESSE.9b": new Nodes.RecvText(
    "I learned that word for Chemistry, or English, or maybe Latin",
    "MON.JESSE.9c"),

    "MON.JESSE.9c": new Nodes.RecvText(
    "I don’t even remember anymore.",
    "MON.RESPONSE.9"),

    "MON.RESPONSE.9": new Nodes.SendText(
    "Jesse, how long has it been since you took a break?",
    "MON.JESSE.10"),

    "MON.JESSE.10": new Nodes.RecvText(
    "How long does it take a sparrow to fly to New Zealand?",
    "MON.JESSE.10a"),

    "MON.JESSE.10a": new Nodes.RecvText(
    "How long did it take to catch something in the rye?",
    "MON.JESSE.10b"),

    "MON.JESSE.10b": new Nodes.RecvText(
    "How long does it take to kill a mockingbird?",
    "MON.RESPONSE.10"),

    "MON.RESPONSE.10": new Nodes.SendText(
    "A long time then? It's late where you are!",
    "MON.JESSE.11"),

    "MON.JESSE.11": new Nodes.RecvText(
    "Yeah, I'm feeling a little loopy.",
    "MON.RESPONSE.11"),

    "MON.RESPONSE.11": new Nodes.SendText(
    "Get some sleep, Jesse.",
    "MON.RESPONSE.11a"),

    "MON.RESPONSE.11a": new Nodes.SendText(
    "I'm proud of you for working so hard but it's also important to get rest.",
    "MON.JESSE.12"),

    "MON.JESSE.12": new Nodes.RecvText(
    "Happy Thursday",
    "MON.JESSE.12a"),

    "MON.JESSE.12a": new Nodes.RecvText(
    "I wanted to let you know that my phone's almost out of battery",
    "MON.JESSE.12b"),

    "MON.JESSE.12b": new Nodes.RecvText(
    "But I wanted to let you know I'm going to rock studying tonight!",
    "MON.RESPONSE.12"),

    "MON.RESPONSE.12": new Nodes.SendText(
    "That's fantastic. I'm really glad to see you put in so much effort.",
    "MON.JESSE.13"),

    "MON.JESSE.13": new Nodes.RecvText(
    "Also, I made a friend at school",
    "MON.JESSE.13a"),

    "MON.JESSE.13a": new Nodes.RecvText(
    "and things are starting to get a little better, a little less lonely.",
    "MON.JESSE.13b"),

    "MON.JESSE.13b": new Nodes.RecvText(
    "We went to the museum together and he has like all the same interests as me and invited me to join some clubs",
    "MON.RESPONSE.13"),

    "MON.RESPONSE.13": new Nodes.SendText(
    "That’s great news! What grade is he in?",
    "MON.JESSE.14"),

    "MON.JESSE.14": new Nodes.RecvText(
    "Seventh, same as me. We share a bunch of classes.",
    "MON.JESSE.14a"),

    "MON.JESSE.14a": new Nodes.RecvText(
    "And actually, we're studying together tonight, but I'll talk to you tomorrow!",
    "MON.RESPONSE.14"),

    "MON.RESPONSE.14": new Nodes.SendText(
    "Seeya!",
    "MON.JESSE.15"),

    "MON.JESSE.15": new Nodes.RecvText(
    "Ok, ok, ok, I'm sort of freaking out again!",
    "MON.JESSE.15a"),

    "MON.JESSE.15a": new Nodes.RecvText(
    "I know I was scared Tuesday, but now it's Thursday",
    "MON.RESPONSE.15"),

    "MON.RESPONSE.15": new Nodes.SendText(
    "You still have all those assignments due tomorrow?",
    "MON.JESSE.16"),

    "MON.JESSE.16": new Nodes.RecvText(
    "Yeah! I’m mostly done but my mind is just all twisted around the probability stuff.",
    "MON.JESSE.16a"),

    "MON.JESSE.16a": new Nodes.RecvText(
    "Would you mind going through some problems together?",
    "MON.RESPONSE.16"),

    "MON.RESPONSE.16": new Nodes.SendText(
    "Sure, no problem. I don't have much to do tonight.",
    "MON.RESPONSE.16a"),

    "MON.RESPONSE.16a": new Nodes.SendText(
    "And I love teaching things! It actually helps me learn things when I teach them. It solidifies the ideas.",
    "MON.JESSE.17"),

    "MON.JESSE.17": new Nodes.RecvText(
    "Cool, thanks. I really appreciate it.",
    "MON.JESSE.17a"),

    "MON.JESSE.17a": new Nodes.RecvText(
    "My teacher recommended this website called Khan Academy to me - have you heard of it?",
    "MON.RESPONSE.17"),

    "MON.RESPONSE.17": new Nodes.SendText(
    "Yeah, I actually used KA a lot to study for calculus.",
    "MON.RESPONSE.17a"),

    "MON.RESPONSE.17a": new Nodes.SendText(
    "It was actually really helpful,",
    "MON.JESSE.18"),

    "MON.JESSE.18": new Nodes.RecvText(
    "I watched all of the videos but I'm still confused about a few things",
    "MON.JESSE.18a"),

    "MON.JESSE.18a": new Nodes.RecvText(
    "The teacher suggested we might want to study using the Khan Academy exercises, so I've been trying them, but I'm sort of still struggling.",
    "MON.RESPONSE.18"),

    "MON.RESPONSE.18": new Nodes.SendText(
    "I'll see what I can do to help",
    "MON.RESPONSE.18a"),

    "MON.RESPONSE.18a": new Nodes.SendText(
    "You know, you generally shouldn't leave studying to the last moment like this",
    "MON.JESSE.19"),

    "MON.JESSE.19": new Nodes.RecvText(
    "I know! I've actually been studying all week like you said",
    "MON.JESSE.19a"),

    "MON.JESSE.19a": new Nodes.RecvText(
    "But it's still hard.",
    "MON.JESSE.19b"),

    "MON.JESSE.19b": new Nodes.RecvText(
    "Anyway, the problem I'm looking at now is this one",
    "MON.JESSE.19c"),

    "MON.JESSE.19c": new Nodes.RecvImage(
    "images/card.jpg",
    "MON.JESSE.19d"),

    "MON.JESSE.19d": new Nodes.RecvText(
    "Ahhhhhhhhh!",
    "MON.RESPONSE.19"),

    "MON.RESPONSE.19": new Nodes.SendText(
    "OK, don't worry. Let's work through this together",
    "MON.JESSE.20"),

    "MON.JESSE.20": new Nodes.RecvText(
    "BUT I WANT TO WORRY",
    "MON.RESPONSE.20"),

    "MON.RESPONSE.20": new Nodes.SendText(
    "What do you know about how to solve this kind of problem?",
    "MON.RESPONSE.20a"),

    "MON.RESPONSE.20a": new Nodes.SendText(
    "What have you learned about this stuff so far?",
    "MON.JESSE.21"),

    "MON.JESSE.21": new Nodes.RecvText(
    "Well, I guess I know P means 'the probability of'",
    "MON.RESPONSE.21"),

    "MON.RESPONSE.21": new Nodes.SendText(
    "What else? What do you see in the problem?",
    "MON.JESSE.22"),

    "MON.JESSE.22": new Nodes.RecvText(
    "I know that there are ten cards and that three of them are black",
    "MON.JESSE.22a"),

    "MON.JESSE.22a": new Nodes.RecvText(
    "but isn't the probability then just not probable?",
    "MON.RESPONSE.22"),

    "MON.RESPONSE.22": new Nodes.SendText(
    "Have you done any problems like this in the past?",
    "MON.JESSE.23"),

    "MON.JESSE.23": new Nodes.RecvText(
    "Well, let me see...",
    "MON.JESSE.23a"),

    "MON.JESSE.23a": new Nodes.RecvText(
    "Oh, here's one!",
    "MON.JESSE.23b"),

    "MON.JESSE.23b": new Nodes.RecvText(
    "So i guess this means that I can set it up where the cards are like the balls",
    "MON.JESSE.23c"),

    "MON.JESSE.23c": new Nodes.RecvText(
    "so it's ... 3 / (3 + 7)",
    "MON.JESSE.23d"),

    "MON.JESSE.23d": new Nodes.RecvText(
    "which is .3",
    "MON.JESSE.23e"),

    "MON.JESSE.23e": new Nodes.RecvText(
    "Wow! Thanks for you help!",
    "MON.RESPONSE.23"),

    "MON.RESPONSE.23": new Nodes.SendText(
    "Awesome, you got it. Nice work. And I like the work you put into the initial exercise.",
    "MON.RESPONSE.23a"),

    "MON.RESPONSE.23a": new Nodes.SendText(
    "The answer was in you all along, young one",
    "MON.JESSE.24"),

    "MON.JESSE.24": new Nodes.RecvText(
    "Thanks, haha, I like markers!",
    "MON.JESSE.24a"),

    "MON.JESSE.24a": new Nodes.RecvText(
    "I'm going to try tackling a few more problems, I'll let you know when I have more questions",
    "MON.RESPONSE.24"),

    "MON.RESPONSE.24": new Nodes.SendText(
    "sounds good!",
    "MON.JESSE.25"),

    "MON.JESSE.25": new Nodes.RecvImage(
    "images/dhruv.png",
    "MON.JESSE.25a"),

    "MON.JESSE.25a": new Nodes.RecvText(
    "I have SO MANY QUESTIONS:",
    "MON.JESSE.25b"),

    "MON.JESSE.25b": new Nodes.RecvText(
    "Was his name always Dhruv?",
    "MON.JESSE.25c"),

    "MON.JESSE.25c": new Nodes.RecvText(
    "Did he change it after he became an obsessive car dealership window shopper?",
    "MON.JESSE.25d"),

    "MON.JESSE.25d": new Nodes.RecvText(
    "Did the name Dhruv CAUSE him to be a compulsive Dhruver?",
    "MON.RESPONSE.25"),

    "MON.RESPONSE.25": new Nodes.SendText(
    "These are the great imponderables of the universe.",
    "MON.JESSE.26"),

    "MON.JESSE.26": new Nodes.RecvText(
    "I just started working on this problem and I tried to get the answer",
    "MON.JESSE.26a"),

    "MON.JESSE.26a": new Nodes.RecvText(
    "but the site said I was wrong and I don't really understand why",
    "MON.JESSE.26b"),

    "MON.JESSE.26b": new Nodes.RecvText(
    "I know I could ask the hints, but I like how you explain things",
    "MON.JESSE.26c"),

    "MON.JESSE.26c": new Nodes.RecvText(
    "Here's the work I did so far",
    "MON.JESSE.26d"),

    "MON.JESSE.26d": new Nodes.RecvImage(
    "images/problem2.png",
    "MON.RESPONSE.26"),

    "MON.RESPONSE.26": new Nodes.SendText(
    "Looking through your steps, do you feel confident in every single one?",
    "MON.RESPONSE.26a"),

    "MON.RESPONSE.26a": new Nodes.SendText(
    "Or do any of the steps make you think “maybe I was just guessing here?”",
    "MON.JESSE.27"),

    "MON.JESSE.27": new Nodes.RecvText(
    "I not so confident in the part where I set the denominator",
    "MON.JESSE.27a"),

    "MON.JESSE.27a": new Nodes.RecvText(
    "I'm not exactly sure what it's supposed to be but I put together the numbers I saw because that usually works?",
    "MON.RESPONSE.27"),

    "MON.RESPONSE.27": new Nodes.SendText(
    "Remind me not to let you be a safety inspector at a nuclear facility :p",
    "MON.RESPONSE.27a"),

    "MON.RESPONSE.27a": new Nodes.SendText(
    "Just kidding, that sort of strategy works a lot, but as you move forward in math, it becomes more and more important to have some kind of intuition for what’s happening.",
    "MON.RESPONSE.27b"),

    "MON.RESPONSE.27b": new Nodes.SendText(
    "If you think about what you know about probability, what do you think the denominator means?",
    "MON.JESSE.28"),

    "MON.JESSE.28": new Nodes.RecvText(
    "It’s… the space of all possible outcomes? Oh! I see what happened! I can fix this!",
    "MON.RESPONSE.28"),

    "MON.RESPONSE.28": new Nodes.SendText(
    "Great!",
    "MON.JESSE.29"),

    "MON.JESSE.29": new Nodes.RecvText(
    "Hey, thanks so much for your help. It's getting kinda late now though, and I’m not making great progress anymore.",
    "MON.RESPONSE.29"),

    "MON.RESPONSE.29": new Nodes.SendText(
    "Sounds like you should get some rest. You have a big day tomorrow",
    "MON.JESSE.30"),

    "MON.JESSE.30": new Nodes.RecvText(
    "Oy vey, tell me about it. I appreciate everything you've done.",
    "MON.RESPONSE.30"),

    "MON.RESPONSE.30": new Nodes.SendText(
    "Let me know how it goes tomorrow, 'k?",
    "MON.JESSE.31"),

    "MON.JESSE.31": new Nodes.RecvText(
    "Sure! I'll text you as soon as I get my test back.",
    "MON.RESPONSE.31"),

    "MON.RESPONSE.31": new Nodes.SendText(
    "Looking forward to it! Talk to you tomorrow!",
    "MON.JESSE.32"),

    "MON.JESSE.32": new Nodes.RecvText(
    "I just got my test results in the email!",
    "MON.JESSE.32a"),

    "MON.JESSE.32a": new Nodes.RecvText(
    "The teachers here are so tech-savvy!",
    "MON.JESSE.32b"),

    "MON.JESSE.32b": new Nodes.RecvText(
    "I'll forward you the results.",
    "MON.JESSE.32c"),

    "MON.JESSE.32c": new Nodes.RecvText(
    "Another exciting thing happened today though also!",
    "MON.RESPONSE.32"),

    "MON.RESPONSE.32": new Nodes.SendText(
    "Did you get the part in the play?",
    "MON.JESSE.33"),

    "MON.JESSE.33": new Nodes.RecvText(
    "Yeah, I totally did! I'm the cat! I'm going to look FIERCE! And terrifying.",
    "MON.JESSE.33a"),

    "MON.JESSE.33a": new Nodes.RecvText(
    "I have to go to rehearsal now though, so I have to turn off my phone.",
    "MON.RESPONSE.33"),

    "MON.RESPONSE.33": new Nodes.SendText(
    "Well, I’m glad you got the part!",
    "MON.RESPONSE.33a"),

    "MON.RESPONSE.33a": new Nodes.SendText(
    "I'll check out your results.",
    "MON.RESPONSE.33b"),

    "MON.RESPONSE.33b": new Nodes.SendText(
    "Have a great time at rehearsal!",
    "END"),



    "END": new Nodes.GameOver()
};
module.exports = GAME_TREE;
