var restify = require('restify');
var builder = require('botbuilder');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
	console.log('%s listening to %s', server.name, server.url); 
});

var connector = new builder.ChatConnector({
	appId: process.env.MICROSOFT_APP_ID,
	appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

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
		var msg = new builder.Message(session)
		.attachmentLayout(builder.AttachmentLayout.carousel)
		.attachments([
			new builder.HeroCard(session)
				.title("Data Privacy")
				.subtitle("We process and protect personal data in compliance with data privacy laws...")
				.buttons([
					builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle", "View on website")
				]),
			new builder.HeroCard(session)
				.title("Personal Conflicts of Interests")
				.subtitle("We ensure our personal interests and relationships don't create conflicts for Accenture...")
				.buttons([
					builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Pike_Place_Market", "View on website")
				]),
			new builder.HeroCard(session)
				.title("Information Security")
				.subtitle("We protect confidential information of Accenture, clients and others from unauthorized use or disclosure...")
				.buttons([
					builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/EMP_Museum", "View on website")
				]),
			new builder.HeroCard(session)
				.title("Information Security")
				.subtitle("We follow Accenture’s requirements for protecting and using information, devices and technology belonging to Accenture, clients, suppliers and other parties...")
				// .images([
				//     builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Night_Exterior_EMP.jpg/320px-Night_Exterior_EMP.jpg")
				//         .tap(builder.CardAction.showImage(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Night_Exterior_EMP.jpg/800px-Night_Exterior_EMP.jpg"))
				// ])
				.buttons([
					builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/EMP_Museum", "View on website"),
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
			session.endDialog('k you %s a topic about %s', action, item);
		} 
		else if (results.response.entity.toLowerCase().search("none") != -1){
			//replace dialog with carousel 2
			//session.replaceDialog("/carousel");
			session.send("Let's try this again");
			session.replaceDialog("/askQuestion");
		}
		else if (results.response.entity.search("something else") != -1){
			//replace dialog with carousel 2
			session.send("Let's try this again");
			session.replaceDialog("/carousel");
		}
		else {
			session.endDialog("Sorry I didn't really understand but cool story");
			//session.endDialog('You %s "%s"', action, item);
		}
	}    
]);

