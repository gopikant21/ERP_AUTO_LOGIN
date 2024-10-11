chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
      // Open the login page when the extension is installed
      chrome.tabs.create({
        url: chrome.runtime.getURL("erp_page.html")
      });
    }
  });
  