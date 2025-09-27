const TOGGLE_MENU_ID = "youwork-toggle";
const ICON_PATH = "img/icon_128.png";

function ensureContextMenu() {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: TOGGLE_MENU_ID,
            title: "Pause/Resume YouWork",
            contexts: ["action"],
        });
    });
}

function showNotification(message) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: ICON_PATH,
        title: "YouWork",
        message,
    });
}

ensureContextMenu();

chrome.runtime.onInstalled.addListener(() => {
    ensureContextMenu();
});

chrome.runtime.onStartup.addListener(() => {
    ensureContextMenu();
});

chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId !== TOGGLE_MENU_ID) {
        return;
    }

    chrome.storage.local.get("youwork_is_paused", (result) => {
        const paused = result.youwork_is_paused === true;
        const newValue = !paused;
        chrome.storage.local.set({ youwork_is_paused: newValue }, () => {
            if (chrome.runtime.lastError) {
                console.error("Failed to update pause state", chrome.runtime.lastError);
                return;
            }

            const message = newValue
                ? "YouWork Paused."
                : "YouWork Resumed. If YouTube is open, refresh it.";
            showNotification(message);
        });
    });
});
