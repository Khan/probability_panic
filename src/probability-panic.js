var Nodes = require("../build/nodes.js");



// Being at some nodes means that the player has just done something
// mean or nice or promoting of growth mindset or w/e.
// We want to be able to count this stuff at the end of the game so we
// keep track of which nodes caused what states here.
var NODE_TYPES = {
    "MEAN": ["MON.HOMEWORK.OFFENDEDa",
             "MON.HOMEWORK.OFFENDEDb"],
    "NICE": ["MON.SCHOOL",
             "MON.FUN",
             "MON.CITY",
             "MON.HOMEWORK"],
    "GROWTH_MINDSET": ["MON.HOMEWORK.ELABORATEb"],
    "FIXED_MINDSET": ["MON.HOMEWORK.ELABORATEa"],
}


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
        "Hey, Jesse! What's new since I saw you?",
        "MON.JESSE.NEW"),

    // Jesse's update on life
    "MON.JESSE.NEW": new Nodes.RecvText(
        "I'm great :)",
        "MON.JESSE.NEW1"),

    "MON.JESSE.NEW1": new Nodes.RecvText(
        "I miss you and the family.",
        "MON.JESSE.NEW2"),

    "MON.JESSE.NEW2": new Nodes.RecvText(
        "I can’t talk too long. I already have homework. 😞",
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
            "Well, good. Stay strong 💕",
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
            "/images/cheshire-cat.jpg", "MON.FUN.RESPONSE3c"),

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
        {label: "I'll get back to you in a few days.",
        nextNode: "END"},
        {label: "At the end of this awesome hackathon!",
        nextNode: "END"}]),








    "END": new Nodes.GameOver()
};
module.exports = GAME_TREE;
