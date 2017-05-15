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
function CreateHeroCard(session, builder, title, subtitle, text, url, buttons){
    var card = new builder.HeroCard(session)
        .title(title)
        .subtitle(subtitle)
        .text(text)     
        .images([builder.CardImage.create(session, url)])
        .buttons(buttons);      
    return card;
}

function SendHeroCard(session, builder){
    var buttons = [];   
    buttons.push(builder.CardAction.imBack(session, "Thumbs Up", "Thumbs Up"));
    buttons.push(builder.CardAction.imBack(session, "Thumbs Down", "Thumbs Down"));
    buttons.push(builder.CardAction.openUrl(session, "https://www.bing.com/images/search?q=bender&qpvt=bender&qpvt=bender&qpvt=bender&FORM=IGRE", "I feel lucky"));  

    var attachments = [];
    var card = CreateHeroCard(session, builder, "Surface Pro 4", "Surface Pro 4 is a powerful, versatile, lightweight laptop.", 
                            "Surface does more. Just like you. For one device that does everything, you need more than a mobile OS. Surface Pro 4 has a laptop class keyboard,- full-size USB 3.0, microSD- card reader, and a Mini DisplayPort – and it runs full professional-grade software.",
                            "https://compass-ssl.surface.com/assets/b7/3c/b73ccd0e-0e08-42b5-9f8d-9143223eafd0.jpg?n=Hero-panel-image-gallery_03.jpg",  
                            buttons);

    attachments.push(card);

    var msg = new builder.Message(session)
    .attachments(attachments);
    session.send(msg);
};


bot.dialog('/', [
    function (session) {
        session.beginDialog('/askQuestion');
    },
    function (session, results) {
        session.send("Ok, is your question around one of these 4 topics?");
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
                        builder.CardAction.imBack(session, "menu:102", "Select menu")
                    ])
           ]);
           session.send(msg);
            //builder.Prompts.choice(session, msg, "select:100|select:101|select:102");
           //builder.Prompts.choice(session, "Was I helpful?", "startover:101|menu:001", {listStyle: builder.ListStyle.button});
           
    },
    function (session, results) {
        var action, item;
        //console.log(results.response.entity);
        if(results.response.entity.search("select") != -1){
            session.endDialog('k you selected a topic');
        }

        // var kvPair = results.response.entity.split(':');
        // switch (kvPair[0]) {
        //     case 'select':
        //         action = 'selected';
        //         break;
        //     case 'menu':
        //         action = 'menu';
        //         break;
        //     case 'startover':
        //         action= 'startover';
        //         break
        // }
        // switch (kvPair[1]) {
        //     case '100':
        //         item = "Data Privacy";
        //         break;
        //     case '101':
        //         item = "Personal Conflicts of Interests";
        //         break;
        //     case '102':
        //         item = "Information Security";
        //         break;
        // }
        // if (action == "menu"){
        //      session.replaceDialog("/carousel");
        // }
        // if (action == "startover"){
        //      session.replaceDialog("/");
        // }
        else {
            session.endDialog('k cool story');
            //session.endDialog('You %s "%s"', action, item);
        }
    }    
]);