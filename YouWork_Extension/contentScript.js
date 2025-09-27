chrome.storage.local.get("youwork_is_paused", (result) => {
    if (result.youwork_is_paused === true) {
        console.log("YouWork paused. Redirect disabled.");
        return;
    }

    const currentUrl = window.location.href;
    let redirectUrl = "https://tash-had.github.io/YouWork";

    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = currentUrl.match(regExp);
    if (match && match[2].length === 11) {
        const videoId = match[2];
        redirectUrl = `${redirectUrl}?videoId=${videoId}`;
    }

    window.location.href = redirectUrl;
});
