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


/*chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getCredentials") {
    fetch("http://localhost:3000/get-credentials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: message.email })
    })
      .then(response => response.json())
      .then(data => {
        sendResponse({ credentials: data });
      })
      .catch(error => {
        sendResponse({ error: error.message });
      });

    return true; // Keeps the sendResponse async
  }
});*/


  