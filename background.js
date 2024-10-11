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


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getCredentials") {
    fetch("https://erp-auto-login.onrender.com/get-credentials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: message.email })  // Send the email in JSON format
    })
      .then(response => {
        // Check if the response is ok (status 200-299)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();  // Parse the JSON from the response
      })
      .then(data => {
        sendResponse({ credentials: data });  // Send the credentials as a JSON object
      })
      .catch(error => {
        sendResponse({ error: error.message });  // Send error in JSON format
      });

    return true; // Keeps the sendResponse async
  }
});



  