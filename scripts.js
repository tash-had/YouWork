$(document).ready(function() {
    $("#loadMoreBtn").hide();
});
var ytObj = new apiheap("youtube", "AIzaSyCE1D-pcjpBzXa0iL60A4SUMDCgNS2uqy4"),
    query_data = [],
    loadMoreCount = 1;

function search() {
    var deferredObj = $.Deferred();
    var searchQuery = $('#searchField').val();
    ytObj.youtube("search", "snippet", "q=" + searchQuery);
    setTimeout(function() {
        deferredObj.resolve();
    }, 1000);
    query_data.push(ytObj.RESPONSE);
    $("#loadMoreBtn").show(2000);
    return deferredObj;
}

var executeSearch = function() {
    console.log(ytObj.parse(query_data, "vid_thumbnails"));
}

function loadMore() {

    var defferedObj_two = $.Deferred();
    var searchQuery = $('#searchField').val();
    try {
        loadMoreCount++;
        ytObj.youtube("search", "snippet", "q=" + searchQuery, pageToken(ytObj.RESPONSE));
        $('#loadMoreBtn').attr("value", "Load More | Pg.1-" + loadMoreCount);
    } catch (err) {
        console.log("Request Error. You may be making too many simultaneous requests.");
    }

    setTimeout(function() {
        defferedObj_two.resolve();
    }, 1000);
    query_data.push(ytObj.RESPONSE);

    return defferedObj_two;
}
