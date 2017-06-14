module.exports = function () {
    //process.env variables defined in Azure if deployed to a web app. For testing, place IDs and Keys inline
    global.searchName = process.env.AZURE_SEARCH_NAME ? process.env.AZURE_SEARCH_NAME : "ethics";
    global.indexName = process.env.INDEX_NAME ? process.env.AZURE_SEARCH_NAME : "ethicsindex";
    global.searchKey = process.env.INDEX_NAME ? process.env.AZURE_SEARCH_KEY : "1B00A9C8F4FE8B7970E4249C12E141E4";
    
    global. queryString = 'https://' + searchName + '.search.windows.net/indexes/' + indexName + '/docs?api-key=' + searchKey + '&api-version=2015-02-28&';

    //https://ethics.search.windows.net
    //do not use admin key -- generate alternative generated "search key"
}