document.getElementById('autofillButton').addEventListener('click', function() {
    // Send a message to content.js to start autofill
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "startAutofill" }, function(response) {
        console.log("Autofill button clicked!!");
      });
    });
  });
  
