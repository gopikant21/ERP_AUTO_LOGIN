document.getElementById('activate-button').addEventListener('click', () => {
    // Send a message to the content script
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'activate'});
    });
});
