// Background script for Element Extractor extension
chrome.runtime.onInstalled.addListener(() => {
    console.log('Element Extractor extension installed');
});

// Handle messages between popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractionComplete') {
        // Forward message to popup if it's open
        chrome.runtime.sendMessage(request).catch(() => {
            // Popup might be closed, which is fine
        });
    }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    // This will open the popup automatically due to manifest configuration
    // No additional handling needed
});
