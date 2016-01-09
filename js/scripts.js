$(document).ready(function() {
    $("#loadMoreBtn").hide();
    $("#clearBtn").hide();

});
var ytObj = new apiheap("youtube", "AIzaSyCE1D-pcjpBzXa0iL60A4SUMDCgNS2uqy4"),
    query_data, titles = ids = descs = channels = thumbs = type = amount = lb = [],
    loadMoreCount = 1;

function search() {
    document.getElementById('videoGrid').innerHTML = "";
    loadMoreCount = 1;
    $('#loadMoreBtn').attr("value", "Load More | Pg.1-" + loadMoreCount);
    query_data = [];
    var deferredObj = $.Deferred();
    var searchQuery = $('#searchField').val();
    ytObj.youtube("search", "snippet", "q=" + searchQuery);
    setTimeout(function() {
        deferredObj.resolve();
    }, 1000);
    query_data.push(ytObj.RESPONSE);
    $("#loadMoreBtn").show(200);
    $("#clearBtn").show(200);
    return deferredObj;

}

var executeSearch = function() {
    titles = ytObj.parse(query_data, "vid_titles");
    ids = ytObj.parse(query_data, "vid_ids");
    descs = ytObj.parse(query_data, "vid_descriptions");
    channels = ytObj.parse(query_data, "chan_names");
    thumbs = ytObj.parse(query_data, "vid_thumbnails");
    type = ytObj.parse(query_data, "type");
    amount = ids.length;
    lb = "<br>";

    for (loopCount = 0; loopCount < amount; loopCount++) {
        if (type[loopCount] === "youtube#video") {
            document.getElementById('videoGrid').innerHTML =
                document.getElementById('videoGrid').innerHTML +
                '<li>' + '<div class=videoDiv>' +
                '<a href=javascript:void(0) onclick=showVideo(' + loopCount + ');><img src="' + thumbs[loopCount] + '" height=150 width=200 alt="Video Thumbnail"/></a>' + lb +
                '<b>Video Title: </b>' + titles[loopCount] + lb +
                '<span class="vidDescs">' + '<b>Video Description </b>' + descs[loopCount] + '</span>' + lb +
                '<b>Channel Name: </b>' + channels[loopCount] + '</div>' + '</li>';
        }
    }
    //minimizeDescs(); 
}

function loadMore() {
    document.getElementById('videoGrid').innerHTML = "";


    var defferedObj_two = $.Deferred();
    var searchQuery = $('#searchField').val();
    try {
        loadMoreCount++;
        ytObj.youtube("search", "snippet", "q=" + searchQuery, pageToken(ytObj.RESPONSE));
        if (!loadMoreCount === 1) {}
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

function clearPage() {
    document.getElementById('videoGrid').innerHTML = '';
    query_data = [];
    $("#loadMoreBtn").hide();
    $("#clearBtn").hide();
    loadMoreCount = 1;

}

function showVideo(loopCount) {
    alertify.YoutubeDialog(ids[loopCount]).set({
        frameless: false,
        title: channels[loopCount]
    });
}

/*
function minimizeDescs(){
    $('.vidDescs').readmore({
        speed: 75, 
        maxHeight: 20, 
        moreLink: '<a href="#">Read More</a>', 
        lessLink: '<a href="#">Read Less</a>'
    });
}*/
