chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
      // Open the login page when the extension is installed
      chrome.tabs.create({
        url: chrome.runtime.getURL("form.html")
      });
    }
});


chrome.runtime.onSuspend.addListener(function() {
  chrome.storage.local.clear(function() {
    alert("Storage cleared on extension disable/uninstall");
  });
});




  