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
    try {
        ytObj.youtube("search", "snippet", "q=" + searchQuery);
    } catch (err) {
        console.log("caught it"); 
        search().done(executeSearch);
    }
    setTimeout(function() {
        deferredObj.resolve();
    }, 420);
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
        if (type[loopCount] === "youtube#video" || type[loopCount] === "youtube#playlist") {
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
        }, 420);
        query_data.push(ytObj.RESPONSE);

        return defferedObj_two;
    }
//enablejsapi=1 to embedd params to shut off vid on close
function showVideo(loopCount, videoId) {
    var embedId;
    var titleToUse;
    var videoEmbedSuffix = "?enablejsapi=1&autoplay=1&rel=0&showinfo=0&iv_load_policy=3&color=white&fs=0&disablekb=0&cc_load_policy=0";
    
    if (loopCount == -1 && (videoId != undefined && videoId != "undefined" != videoId == null) && videoId.length > 3) {
        // A specific video has been requested (i.e. user clicked a link)
        embedId = videoId + videoEmbedSuffix;
        // don't know the title in this case since we didnt run a search
        titleToUse = "";
    }
    else {
        if (ids[loopCount].substr(0, 2) === "PL") {
            embedId = "?list=" + ids[loopCount] + "&enablejsapi=1&autoplay=1&rel=0&iv_load_policy=3&color=white&fs=0&disablekb=0&cc_load_policy=0";
        } else {
            embedId = ids[loopCount] + videoEmbedSuffix;
        }

        titleToUse = titles[loopCount];
    }

    alertify.YoutubeDialog(embedId).set({
        frameless: false,
        title: titleToUse,
        onclose: function() {
            alertify.success('<span style="display:block;text-align:center;color:white;">Video Paused.',2);
        }
    });
    
    // We want to hide all except the search field and the clear button, so we can give the user
    // the choice of re-using their last search query or clearing it. 
    hideGrid();
    query_data = [];
    $("#loadMoreBtn").hide(200);
    loadMoreCount = 1;
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
