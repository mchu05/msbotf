module.exports = function () {
    bot.dialog('/showResults', [
        function (session, args) {
            // var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel);
            //     args.result['value'].forEach(function (item, i) {
            //         msg.addAttachment(
            //             new builder.HeroCard(session)
            //                 .title(item.title)
            //                 .subtitle("Search Score: " + item['@search.score'])
            //                 .text(item.description)
            //                 .images([builder.CardImage.create(session, item.imageUrl)])
            //         );
            //     })
            //     session.endDialog(msg);
        }
    ])
}