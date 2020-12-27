var paused_youwork;

chrome.storage.local.get('youwork_is_paused', function (result) {
    if (result.youwork_is_paused === true) {
        console.log("YouWork paused. Redirect disabled.");
    } else {

        var currentUrl = location.href;
        var redirectUrl = "https://tash-had.github.io/YouWork";

        var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = currentUrl.match(regExp);
        if (match && match[2].length == 11) {
            var videoId = match[2];
            redirectUrl = redirectUrl + "?videoId=" + videoId; 
        }

        window.location = redirectUrl;
    }
});

try {
    chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
        title: "Pause/Resume YouWork",
        contexts: ["browser_action"],
        onclick: function () {
            chrome.storage.local.get('youwork_is_paused', function (result) {
                paused_youwork = result.youwork_is_paused;
                if (paused_youwork == true) {
                    chrome.storage.local.set({
                        'youwork_is_paused': false
                    }, function () {
                        alert("YouWork Resumed. If YouTube is open, refresh it.");
                    });
                } else {
                    chrome.storage.local.set({
                        'youwork_is_paused': true
                    }, function () {
                        alert("YouWork Paused.");
                    });
                }
            });

        }
    });
} catch (err) { }