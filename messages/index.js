"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');

require('./dialogs/results.js')(); 
require('./dialogs/musicianExplorer.js')();
require('./dialogs/musicianSearch.js')();

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
        builder.Prompts.choice(session, "Hi how would you like me to help?", choices);
    },
    function (session, results) {
        if (results.response) {
            var selection = results.response.entity;
            // route to corresponding dialogs
            switch (selection) {
                case "Explorer":
                    session.replaceDialog('/explore');
                    break;
                case "Search":
                    session.replaceDialog('/search');
                    break;
                default:
                    session.reset('/');
                    break;
            }
        }
    }
]);

// bot.dialog('/search', [
//         function (session) {
//             //Prompt for string input
//             builder.Prompts.text(session, "Type in something you are searching for");
//         },
//         function (session, results) {
//             //Sets name equal to resulting input
//             var name = results.response;

//             var queryString = searchQueryStringBuilder('search= ' + name);
//             performSearchQuery(queryString, function (err, result) {
//                 if (err) {
//                     console.log("Error when searching: " + err);
//                 } else if (result && result['value'] && result['value'][0]) {
//                     //If we have results send them to the showResults dialog (acts like a decoupled view)
//                     session.replaceDialog('/showResults', { result });
//                 } else {
//                     session.endDialog("Nothing by \'" + name + "\' found");
//                 }
//             })
//         }
// ]);



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
