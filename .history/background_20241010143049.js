chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
      // Open the login page when the extension is installed
      chrome.tabs.create({
        url: chrome.runtime.getURL("form.html")
      });
    }
});

// background.js
chrome.runtime.onSuspend.addListener(function() {
  chrome.storage.local.clear(function() {
    console.log("Storage cleared on extension disable/uninstall");
  });
});

  