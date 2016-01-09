//Declaring/initializing variables 
var ytObj = new apiheap("youtube", "MY_API_KEY"),
    query_data, titles = ids = descs = channels = thumbs = type = amount = lb = [],
    loadMoreCount = 1;

//Making search query 
function search() {
    hideGrid();
    loadMoreCount = 1;
    $('#loadMoreBtn').attr("value", "Load More | Pg.1-" + loadMoreCount);
    query_data = [];
    var deferredObj = $.Deferred();
    var searchQuery = $('#searchField').val();
    try {
        ytObj.youtube("search", "snippet", "q=" + searchQuery);
    } catch (err) {}
    //Resolving defferred object
    setTimeout(function() {
        deferredObj.resolve();
    }, 420);
    //Pushing data into array
    query_data.push(ytObj.RESPONSE);
    $("#loadMoreBtn").show(200);
    $("#clearBtn").show(200);
    return deferredObj;
}

//Function that is run automatically after search query/load more function   
var executeSearch = function() {
    //parsing data from data array using parse() function 
    titles = ytObj.parse(query_data, "vid_titles");
    ids = ytObj.parse(query_data, "vid_ids");
    //descs = ytObj.parse(query_data, "vid_descriptions");
    channels = ytObj.parse(query_data, "chan_names");
    thumbs = ytObj.parse(query_data, "vid_thumbnails");
    type = ytObj.parse(query_data, "type");
    amount = ids.length;
    lb = "<br>";
    $("#videoGrid").hide();

    //For-loop to loop through data, and print it
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

//Function to load more results
function loadMore() {
    hideGrid();

    var defferedObj_two = $.Deferred();
    var searchQuery = $('#searchField').val();

    //Using nextPageToken from YouTube JSON data to get results from next page
    try {
        loadMoreCount++;
        ytObj.youtube("search", "snippet", "q=" + searchQuery, pageToken(ytObj.RESPONSE));
        if (!loadMoreCount === 1) {}
        $('#loadMoreBtn').attr("value", "Load More | Pg.1-" + loadMoreCount);
    } catch (err) {
        console.log("Request Error. You may be making too many simultaneous requests.");
    }

    //Resolving defferred object
    setTimeout(function() {
        defferedObj_two.resolve();
    }, 420);
    query_data.push(ytObj.RESPONSE);

    return defferedObj_two;
}

//Function to show video 
function showVideo(loopCount) {
    //Checking if result is a playlist or not, and changing iFrame source accordingly
    var embedId;
    if (ids[loopCount].substr(0, 2) === "PL") {
        embedId = "?list=" + ids[loopCount] + "&autoplay=1";
    } else {
        embedId = ids[loopCount] + "?enablejsapi=1&autoplay=1";
    }
    //Using alertify.YoutubeDialog to show video in alert dialog 
    alertify.YoutubeDialog(embedId).set({
        frameless: false,
        title: channels[loopCount],
        onclose: function() {
            if (embedId.substr(0, 1) === "?") {
                alertify.success('<span style="color:white;">Refresh the page to stop background player.</span>');
            }
        }
    });
    hideGrid(1);
}

//Function to hide video grid. 
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

//Function to initiate search when enter button is pressed while search field has focus
$("#searchField").keyup(function(event) {
    if (event.keyCode == 13) {
        $("#searchBtn").click();
    }
});