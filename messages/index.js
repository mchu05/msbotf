"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');
var request = require('request');

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var searchName = process.env.AZURE_SEARCH_NAME ? process.env.AZURE_SEARCH_NAME : "ethics";
var indexName = process.env.INDEX_NAME ? process.env.AZURE_SEARCH_NAME : "ethicsindex";
var searchKey = process.env.INDEX_NAME ? process.env.AZURE_SEARCH_KEY : "1B00A9C8F4FE8B7970E4249C12E141E4";

var  queryString = 'https://' + searchName + '.search.windows.net/indexes/' + indexName + '/docs?api-key=' + searchKey + '&api-version=2015-02-28&';

var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));


var searchQueryStringBuilder = function (query) {
    return queryString + query + "~5"; // ~5 is fuzzy search
}

var performSearchQuery = function (queryString, callback) {
    console.log(queryString);
    request(queryString, function (error, response, body) {
        if (!error && response && response.statusCode == 200) {
            var result = JSON.parse(body);
            callback(null, result);
        } else {
            callback(error, null);
        }
    })
}



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
                case "Explore":
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

bot.dialog('/search', [
        function (session) {
            //Prompt for string input
            builder.Prompts.text(session, "Type in something you are searching for");
        },
        function (session, results) {
            //Sets name equal to resulting input
            var name = results.response;

            var queryString = searchQueryStringBuilder('search= ' + name);
            performSearchQuery(queryString, function (err, result) {
                if (err) {
                    console.log("Error when searching: " + err);
                } else if (result && result['value'] && result['value'][0]) {
                    //If we have results send them to the showResults dialog (acts like a decoupled view)
                    session.replaceDialog('/showResults', { result });
                } else {
                    session.endDialog("Nothing by \'" + name + "\' found");
                }
            })
        }
]);

bot.dialog('/explore', [
        function (session) {
            builder.Prompts.text(session, "Type in category");
            //seach from tags
        },
        function (session, results) {
            //implementation
            session.endDialog("I couldn't find that category ");
        }
]);

bot.dialog('/showResults', [
        function (session, args) {
            var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel);
                args.result['value'].forEach(function (item, i) {
                    msg.addAttachment(
                        new builder.HeroCard(session)
                            .title(item.title)
                            .subtitle("Search Score: " + item['@search.score'])
                            .text(item.description)
                            .images([builder.CardImage.create(session, item.imageUrl)])
                    );
                })
                session.endDialog(msg);
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
