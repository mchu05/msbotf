module.exports = function () {
    bot.dialog('/musicianSearch', [
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
}

