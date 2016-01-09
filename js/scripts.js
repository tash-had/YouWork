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
    var titles = ytObj.parse(query_data, "vid_titles"); 
    var ids = ytObj.parse(query_data, "vid_ids"); 
    var descs = ytObj.parse(query_data, "vid_descriptions"); 
    var channels = ytObj.parse(query_data, "chan_names"); 
    var thumbs = ytObj.parse(query_data, "vid_thumbnails"); 
    var amount = ids.length; 
    var lb = "<br>"; 

    for(x=0;x<amount;x++){
        document.getElementById('videoGrid').innerHTML = 
        document.getElementById('videoGrid').innerHTML +  
        '<li>'+ '<div class=videoDiv>' +
        '<img src="'+thumbs[x] +'" height=150 width=200 alt="Video Thumbnail"/>'  + lb + 
        '<b>Video Title: </b>' + titles[x] + lb +
           // '<iframe width="560" height="315" src="https://www.youtube.com/embed/'+ids[x]+'" frameborder="0" allowfullscreen></iframe>'+ lb + 
           '<span class="vidDescs">' + '<b>Video Description </b>' + descs[x] + '</span>' +  lb + 
           '<b>Channel Name: </b>' + channels[x] + '</div>' +  '</li>' ;
       }
       minimizeDescs(); 
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
function minimizeDescs(){
    $('.vidDescs').readmore({
        speed: 75, 
        maxHeight: 20, 
        moreLink: '<a href="#">Read More</a>', 
        lessLink: '<a href="#">Read Less</a>'
    });
}