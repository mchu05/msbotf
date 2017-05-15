var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
// var bot = new builder.UniversalBot(connector, function (session){
//     session.send("Hi, I'm the new COBiE bot. I'm like the lawyer in your pocket. What would you like to know about?");
// });
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', [
    function (session) {
        session.beginDialog('/askQuestion');
    },
    function (session, results) {
        session.send("Ok, is your question around one of these 3 topics?");
        session.beginDialog('/carousel');
    }
]);
bot.dialog('/askQuestion', [
    function (session) {
        builder.Prompts.text(session, "Hi, I'm the new COBiE bot. I'm like the lawyer in your pocket. What would you like to know about?");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);
bot.dialog('/carousel', [
    function (session) {
        // Ask the user to select an item from a carousel.
        var msg = new builder.Message(session)
           //.text("This is what I found:")
           //.attachmentLayout(builder.AttachmentLayout.carousel)
           .attachments([
                new builder.HeroCard(session)
                    .title("Data Privacy")
                    .subtitle("We process and protect personal data in compliance with data privacy laws...")
                    // .images([
                    //     builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
                    //         .tap(builder.CardAction.showImage(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/800px-Seattlenighttimequeenanne.jpg")),
                    // ])
                    .buttons([
                        builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle", "Yes, take me to that page"),
                        //builder.CardAction.imBack(session, "select:100", "Select")
                    ]),
                new builder.HeroCard(session)
                    .title("Personal Conflicts of Interests")
                    .subtitle("We ensure our personal interests and relationships don't create conflicts for Accenture...")
                    // .images([
                    //     builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/320px-PikePlaceMarket.jpg")
                    //         .tap(builder.CardAction.showImage(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/800px-PikePlaceMarket.jpg")),
                    // ])
                    .buttons([
                        builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Pike_Place_Market", "Yes, take me to that page"),
                        //builder.CardAction.imBack(session, "select:101", "Select")
                    ]),
                new builder.HeroCard(session)
                    .title("Information Security")
                    .subtitle("We protect confidential information of Accenture, clients and others from unauthorized use or disclosure...")
                    // .images([
                    //     builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Night_Exterior_EMP.jpg/320px-Night_Exterior_EMP.jpg")
                    //         .tap(builder.CardAction.showImage(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Night_Exterior_EMP.jpg/800px-Night_Exterior_EMP.jpg"))
                    // ])
                    
                    .buttons([
                        builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/EMP_Museum", "Yes, take me to that page"),
                        //builder.CardAction.imBack(session, "select:102", "Select")
                    ]),
                new builder.HeroCard(session)
                    .title("Information Security")
                    .subtitle("We follow Accenture’s requirements for protecting and using information, devices and technology belonging to Accenture, clients, suppliers and other parties...")
                    // .images([
                    //     builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Night_Exterior_EMP.jpg/320px-Night_Exterior_EMP.jpg")
                    //         .tap(builder.CardAction.showImage(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Night_Exterior_EMP.jpg/800px-Night_Exterior_EMP.jpg"))
                    // ])
                    
                    .buttons([
                        builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/EMP_Museum", "Yes, take me to that page"),
                        builder.CardAction.imBack(session, "select:102", "Select")
                    ])
           ]);
        builder.Prompts.choice(session, msg, "select:100|select:101|select:102");
    },
    function (session, results) {
        var action, item;
        var kvPair = results.response.entity.split(':');
        switch (kvPair[0]) {
            case 'select':
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
        session.endDialog('You %s "%s"', action, item);
    }    
]);