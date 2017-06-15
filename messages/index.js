"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));

bot.dialog('/', [
    function (session) {
        session.replaceDialog('/promptButtons');
    }
]);

bot.dialog('/promptButtons', [
    function (session) {
        var choices = ["Explore", "Search"]
        builder.Prompts.choice(session, "How would you like me to interact with you?", choices);
    },
    function (session, results) {
        if (results.response) {
            var selection = results.response.entity;
            // route to corresponding dialogs
            switch (selection) {
                case "Explorer":
                    session.replaceDialog('/carousel');
                    break;
                case "Search":
                    session.replaceDialog('/searching');
                    break;
                default:
                    session.reset('/');
                    break;
            }
        }
    }
]);

bot.dialog('/carousel', [
    function (session) {
        var msg = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments([
            new builder.HeroCard(session)
                .title("Data Privacy")
                .subtitle("We process and protect personal data in compliance with data privacy laws Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras turpis dolor, viverra sit amet scelerisque sed, commodo a lectus. \n\n&nbsp;\n\n [Read More](https://www.accenture.com)")
                .images([
                    builder.CardImage.create(session, "http://www.rd.com/wp-content/uploads/sites/2/2016/04/01-cat-wants-to-tell-you-laptop.jpg")
                        .tap(builder.CardAction.showImage(session, "http://www.rd.com/wp-content/uploads/sites/2/2016/04/01-cat-wants-to-tell-you-laptop.jpg"))
                ])
                .buttons([
                    builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle", "Read More")
                ]),
            new builder.HeroCard(session)
                .title("Personal Conflicts of Interests")
                .subtitle("We ensure our personal interests and relationships don't create conflicts for Accenture...")
                .images([
                    builder.CardImage.create(session, "http://www.top13.net/wp-content/uploads/2015/10/perfectly-timed-funny-cat-pictures-5.jpg")
                        .tap(builder.CardAction.showImage(session, "http://www.top13.net/wp-content/uploads/2015/10/perfectly-timed-funny-cat-pictures-5.jpg"))
                ])
                .buttons([
                    builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Pike_Place_Market", "Read More")
                ]),
            new builder.HeroCard(session)
                .title("Information Securitiessss")
                .subtitle("We protect confidential information of Accenture, clients and others from unauthorized use or disclosure...")
                .images([
                    builder.CardImage.create(session, "http://intersystek.com/wp-content/uploads/2015/04/pic8.jpg")
                        .tap(builder.CardAction.showImage(session, "http://intersystek.com/wp-content/uploads/2015/04/pic8.jpg"))
                ])
                .buttons([
                    builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/EMP_Museum", "Read More")
                ]),
            new builder.HeroCard(session)
                .title("Information Security")
                .subtitle("We follow Accenture’s requirements for protecting and using information, devices and technology belonging to Accenture, clients, suppliers and other parties...")
                .images([
                    builder.CardImage.create(session, "http://ksassets.timeincuk.net/wp/uploads/sites/46/2014/02/Ballet-Dancer.jpg")
                        .tap(builder.CardAction.showImage(session, "http://ksassets.timeincuk.net/wp/uploads/sites/46/2014/02/Ballet-Dancer.jpg"))
                ])
                .buttons([
                    builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/EMP_Museum", "Read More"),
                    builder.CardAction.imBack(session, "topic:102", "Tell me more about this topic")
                ])
        ]); 
        session.send(msg);

        var msg2 =  new builder.Message(session)
        .attachments([
            new builder.HeroCard(session)
            .text("Was this helpful?")
            .buttons([
                builder.CardAction.imBack(session, "None of These", "None of these"),
                builder.CardAction.imBack(session, "Lets chat about something else", "Lets chat about something else")
            ])
        ]);

        builder.Prompts.choice(session, msg2, ["topic:102", "Lets chat about something else", "None of These"]);
    },
    function (session, results) {
        var action, item;
        //console.log(results.response.entity);

        if(results.response.entity.search("topic") != -1){
            var kvPair = results.response.entity.split(':');
            switch (kvPair[0]) {
                case 'topic':
                    action = 'selected';
                    break;
            }
            switch (kvPair[1]) {
                case '100':
                    item = "Data Privacy";
                    break;
                case '101':
                    item = "Personal Conflicts of Interests";
                    break;
                case '102':
                    item = "Information Security";
                    break;
            }
            session.endDialog('k you %s a topic about %s is all about following Accenture’s requirements for protecting and using information, devices and technology belonging to Accenture, clients, suppliers and other parties', action, item);
        } 

        else if (results.response.entity.toLowerCase().search("none") != -1){
            //replace dialog with carousel 2
            //session.replaceDialog("/carousel");
            session.send("Ok I have some more results");
            session.replaceDialog("/carousel2");
        }

        else if (results.response.entity.search("something else") != -1){
            //replace dialog with carousel 2
            session.send("Let's try this again");
            session.replaceDialog("/beginQuestion");
        }
        else {
            session.endDialog("Sorry I didn't really understand but cool story");
            //session.endDialog('You %s "%s"', action, item);
        }
    }    
]);


if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}
