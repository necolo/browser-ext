// Background script for Element Extractor extension
chrome.runtime.onInstalled.addListener(() => {
    console.log('Element Extractor extension installed');
});

// Handle messages between content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractionComplete') {
        // Update icon to show extraction is complete
        chrome.action.setIcon({
            tabId: sender.tab.id,
            path: {
                "16": "icons/icon16.png",
                "32": "icons/icon32.png",
                "48": "icons/icon48.png",
                "128": "icons/icon128.png"
            }
        });
        chrome.action.setTitle({
            tabId: sender.tab.id,
            title: "Extract Element"
        });
    }
});

// Handle extension icon click - toggle extraction mode
chrome.action.onClicked.addListener((tab) => {
    // Check current status and toggle extraction
    chrome.tabs.sendMessage(tab.id, {action: 'getStatus'}, function(response) {
        if (response && response.isActive) {
            // Stop extraction
            chrome.tabs.sendMessage(tab.id, {action: 'stopExtraction'});
            chrome.action.setIcon({
                tabId: tab.id,
                path: {
                    "16": "icons/icon16.png",
                    "32": "icons/icon32.png",
                    "48": "icons/icon48.png",
                    "128": "icons/icon128.png"
                }
            });
            chrome.action.setTitle({
                tabId: tab.id,
                title: "Extract Element"
            });
        } else {
            // Start extraction
            chrome.tabs.sendMessage(tab.id, {action: 'startExtraction'});
            chrome.action.setIcon({
                tabId: tab.id,
                path: {
                    "16": "icons/icon16.png",
                    "32": "icons/icon32.png",
                    "48": "icons/icon48.png",
                    "128": "icons/icon128.png"
                }
            });
            chrome.action.setTitle({
                tabId: tab.id,
                title: "Click on any element to extract (ESC to cancel)"
            });
        }
    });
});
