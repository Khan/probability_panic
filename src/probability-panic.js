var Nodes = require("../build/nodes.js");
var GAME_TREE = {
    // Jesse says hi
    "START": new Nodes.RecvText(
        "Hey, cousin! 😊",
        "MON.START.RESPONSE"),

    // Say hi back to Jesse
    "MON.START.RESPONSE": new Nodes.SendChoice([
        {label: "Hey, Jesse! What’s new since I saw you?",
        nextNode: "MON.JESSE.NEW"}]),

    // Jesse's update on life
    "MON.JESSE.NEW": new Nodes.RecvText(
        "I’m great :)",
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
            {label: "Already? What kind of homework", nextNode: "MON.HOMEWORK"},
            {label: "OK, I’ll let you go do homework then.", nextNode: "MON.END"},
        ]),


    /* Conversation about how school's going. */
    // Jesse's first response
    "MON.SCHOOL": new Nodes.RecvText(
        "7th grade is so different! No more recess.",
        "MON.SCHOOL.RESPONSE"),

    // Ask followup question
    "MON.SCHOOL.RESPONSE": new Nodes.SendChoice([
        {label: "Oh no! You’ll have to come back here sometime and play tag with the old crew.",
        nextNode: "MON.SCHOOL1"},
        {label: "Eh, after a while you won’t miss it.",
        nextNode: "MON.SCHOOL1"}
        ]),

    // Jesse's second response
    "MON.SCHOOL1": new Nodes.RecvText(
        "And I feel like people think I’m lame because I’m from Wyoming. They don’t even know where it is! For all they know I’m from Nebraska!",
        "MON.SCHOOL.RESPONSE1"),

    // Ask second followup
    "MON.SCHOOL.RESPONSE1": new Nodes.SendChoice([
        {label: "Sounds about right. New Yorkers are SUPER MEAN. Like, the worst.",
        nextNode: "MON.SCHOOL2"},
        {label: "Oh no! Can I help? Things were really hard for me when I first moved here.",
        nextNode: "MON.SCHOOL2"}
        ]),

    // Jesse's last response
    "MON.SCHOOL2": new Nodes.RecvText(
        "I’ll be ok. Nothing will be as bad as that time Brian Anderson put salamanders in my sandwich in third grade. And I lived through that. Unlike the salamanders.",
        "MON.SCHOOL.RESPONSE3a"),

    // Wrap up conversation and redirect to choices
    "MON.SCHOOL.RESPONSE3a": new Nodes.SendChoice([
            {label: "Well, good. Stay strong 💕",
            nextNode: "MON.SCHOOL.RESPONSE3b"}]),

    "MON.SCHOOL.RESPONSE3b": new Nodes.SendChoice([
            {label: "I’m always here for you, cuz, no matter what.",
            nextNode: "MON.CONVERSATION.CHOICE"}]),


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
            nextNode: "MON.FUN1"}]),

    // Jesse's second response
    "MON.FUN1": new Nodes.RecvText(
        "We’re actually putting on Alice in Wonderland! I’m really excited - it’s supposed to be really whimsical, and the parts are really fun.",
        "MON.FUN.RESPONSE1"),

    // Ask second followup
    "MON.FUN.RESPONSE1": new Nodes.SendChoice([
            {label: "Awesome! Have you ever read the book?",
            nextNode: "MON.FUN2a"}
            ]),

    // Jesse's afraid of cats, apparently
    "MON.FUN2a": new Nodes.RecvText(
        "Noooo, but I’ve been meaning to get around to it! I heard it has cool illustrations?",
        "MON.FUN2b"),
    "MON.FUN2b": new Nodes.RecvText(
        "But that cat has always sort of creeped me out 😒",
        "MON.FUN.RESPONSE3a"),

    // Ask MORE THINGS
    "MON.FUN.RESPONSE3a": new Nodes.SendChoice([
            {label: "You mean this cat? [picture of cat]",
            nextNode: "MON.FUN.RESPONSE3b"}]),

    "MON.FUN.RESPONSE3b": new Nodes.SendChoice([
            {label: "What part did you try out for?.",
            nextNode: "MON.FUN3a"}]),

    // Um apparently not that many parts are gender neutral?
    // Jesse's afraid of cats, apparently
    "MON.FUN3a": new Nodes.RecvText(
        "I actually tried out for the cat.",
        "MON.FUN3b"),
    "MON.FUN3b": new Nodes.RecvText(
        "Fear is the mind killer.",
        "MON.FUN3c"),
    "MON.FUN3c": new Nodes.RecvText(
        "So I’m fighting mine.",
        "MON.FUN.RESPONSE4"),

    // Jesse's a weirdo. Time to wrap this up.
    "MON.FUN.RESPONSE4": new Nodes.SendChoice([
            {label: "lol",
            nextNode: "MON.CONVERSATION.CHOICE"}]),


    /**
      Conversation about city
    **/
    // Jesse's first response
    "MON.CITY": new Nodes.RecvText(
        "It’s bananas!",
        "MON.CITYb"),
    "MON.CITYb": new Nodes.RecvText(
        "Our new apartment is smaller than your living room!",
        "MON.CITY.RESPONSEa"),

    // Ask followup question
    "MON.CITY.RESPONSEa": new Nodes.SendChoice([
            {label: "Well, at least you get to be somewhere different, see somewhere new.",
            nextNode: "MON.CITY.RESPONSEb"}]),
    "MON.CITY.RESPONSEb": new Nodes.SendChoice([
            {label: "I can’t wait to move to the city after I finish my senior year.",
            nextNode: "MON.CITY.RESPONSEc"}]),
    "MON.CITY.RESPONSEc": new Nodes.SendChoice([
            {label: "Then we can go back to Monday Movies. Just like the old days.",
            nextNode: "MON.CITY1"}]),

    // Jesse's second response
    "MON.CITY1": new Nodes.RecvText(
        "I miss you so much.",
        "MON.CITY.RESPONSE1"),

    // Ask second followup
    "MON.CITY.RESPONSE1": new Nodes.SendChoice([
            {label: "I miss you too, Jess. It sucks not having my spunky canoe-paddling minion around. I’ve had to switch to kayaking. The horror!",
            nextNode: "MON.CITY2a"}
            ]),

    // Jesse's afraid of cats, apparently
    "MON.CITY2a": new Nodes.RecvText(
        "The city stinks almost as bad as your canoe steering abilities :P.",
        "MON.CITY2b"),
    "MON.CITY2b": new Nodes.RecvText(
        "Kidding, you’re the best. But this city really does smell like … well, we’re nice, so let’s just say it doesn’t smell like fresh grass. At all.",
        "MON.CITY.RESPONSE3a"),

    // Ask MORE THINGS
    "MON.CITY.RESPONSE3a": new Nodes.SendChoice([
            {label: "Well, I can’t wait to visit and you can show me the good stuff, and what smells to avoid.",
            nextNode: "MON.CONVERSATION.CHOICE"}]),


    /**
      Conversation about math homework
    **/
    // Jesse's first response
    "MON.HOMEWORK": new Nodes.RecvText(
        "We’re studying probability.",
        "MON.HOMEWORKb"),
    "MON.HOMEWORKb": new Nodes.RecvText(
        "This stuff is hard, I’m really not getting it.",
        "MON.HOMEWORK.RESPONSE"),

    // Ask followup question
    "MON.HOMEWORK.RESPONSE": new Nodes.SendChoice([
            {label: "But you’re smart, you were always good at math.",
            nextNode: "MON.HOMEWORK.ELABORATE"},
            {label: "It’s hard for everyone. Keep working at it and eventually you’ll get it!",
            nextNode: "MON.HOMEWORK.ELABORATE"},
            {label: "I’m disappointed in you. You must not be applying yourself enough.",
            nextNode: "MON.HOMEWORK.OFFENDED"},
            {label: "Wah, wah. You don’t hear me complaining about how hard Calculus is.",
            nextNode: "MON.HOMEWORK.OFFENDED"}]),

    "MON.HOMEWORK.ELABORATE": new Nodes.RecvText(
            "Yeah, I know... It's just super difficult",
            "MON.HOMEWORK.RESPONSE1"),
    "MON.HOMEWORK.OFFENDED": new Nodes.RecvText(
            "Hey, since when are you such a jerk?",
            "MON.HOMEWORK.RESPONSE1"),

    // Jesse's second response
    "MON.HOMEWORK.RESPONSE1": new Nodes.SendChoice([
            {label: "Well, PROBABLY you'll get probability. :P. Get it?",
            nextNode: "MON.CONVERSATION.CHOICE"},
            {label: "What part do you not understand?",
            nextNode: "MON.HOMEWORK.ELABORATE1"}]),

    // Ask second followup
    "MON.HOMEWORK.ELABORATE1": new Nodes.RecvText(
            "I don't like all the things with lots of dice...",
            "MON.HOMEWORK.RESPONSE2"),

    // Jesse's afraid of cats, apparently
    "MON.HOMEWORK.RESPONSE2": new Nodes.SendChoice([
            {label: "I see.",
            nextNode: "MON.CONVERSATION.CHOICE"},
            {label: "Do you want some help later?",
            nextNode: "MON.HOMEWORK.ACCEPT_HELP"}]),

    "MON.HOMEWORK.ACCEPT_HELP": new Nodes.RecvText(
            "Yeah, I'd love some! Thanks, you're the best",
            "MON.CONVERSATION.CHOICE"),

    // Wrap up Monday (currently ends game)
    "MON.END": new Nodes.RecvText(
        "Love you. Talk to you soon!",
        "END"),

    "END": new Nodes.GameOver()
};
module.exports = GAME_TREE;
