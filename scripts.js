var ytObj = new apiheap("youtube", "YOUTUBE_API_KEY");

function search() {
    var deferredObj = $.Deferred();
    var searchQuery = $('#searchField').val();
    ytObj.youtube("search", "snippet", "q=" + searchQuery);
    setTimeout(function() {
        deferredObj.resolve();
    }, 1500);
    return deferredObj;
}
var executeSearch = function() {
    console.log(ytObj.parse(ytObj.RESPONSE, "vid_links"));
}
