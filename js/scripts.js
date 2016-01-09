$(document).ready(function() {
    $("#loadMoreBtn").hide();
    $("#clearBtn").hide();

});
var ytObj = new apiheap("youtube", ytKey),
    query_data, titles = ids = descs = channels = thumbs = type = amount = lb = [],
    loadMoreCount = 1;

function search() {
    hideGrid();
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
    //descs = ytObj.parse(query_data, "vid_descriptions");
    channels = ytObj.parse(query_data, "chan_names");
    thumbs = ytObj.parse(query_data, "vid_thumbnails");
    type = ytObj.parse(query_data, "type");
    amount = ids.length;
    lb = "<br>";
    $("#videoGrid").hide();
    for (loopCount = 0; loopCount < amount; loopCount++) {
        if (type[loopCount] === "youtube#video") {
            document.getElementById('videoGrid').innerHTML =
                document.getElementById('videoGrid').innerHTML +
                '<li>' +
                '<a href=javascript:void(0) onclick=showVideo(' + loopCount + ');><img src="' + thumbs[loopCount] + '" height=150 width=200 alt="Video Thumbnail"/></a>' + lb +
                '<b>Video Title: </b>' + titles[loopCount] + lb +
                //'<span class="vidDescs">' + '<b>Video Description </b>' + descs[loopCount] + '</span>' + lb +
                '<b>Channel Name: </b>' + channels[loopCount] + '</li>';
        }
    }
    $("#videoGrid").show(200);
}

function loadMore() {
    hideGrid();

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

function showVideo(loopCount) {
    alertify.YoutubeDialog(ids[loopCount]).set({
        frameless: false,
        title: channels[loopCount],
        /*onclose: function() {
            $("#videoGrid").show(400);
       }*/
    });
    hideGrid(1);
}

function hideGrid(page) {
    $("#videoGrid").hide(200, function() {
        document.getElementById('videoGrid').innerHTML = "";
    });
    if (page) {
        query_data = [];
        $("#loadMoreBtn").hide(200);
        $("#clearBtn").hide(200);
        $("#searchField").val('');
        loadMoreCount = 1;
    }
}

$("#searchField").keyup(function(event) {
    if (event.keyCode == 13) {
        $("#searchBtn").click();
    }
});