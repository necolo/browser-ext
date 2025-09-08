document.addEventListener('DOMContentLoaded', function() {
    const extractBtn = document.getElementById('extractBtn');
    const status = document.getElementById('status');

    // Check if extraction is already active
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'getStatus'}, function(response) {
            if (response && response.isActive) {
                extractBtn.textContent = 'Stop Extracting';
                extractBtn.classList.add('active');
                status.textContent = 'Click on any element to extract';
            }
        });
    });

    extractBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const isActive = extractBtn.classList.contains('active');
            
            if (isActive) {
                // Stop extraction
                chrome.tabs.sendMessage(tabs[0].id, {action: 'stopExtraction'});
                extractBtn.textContent = 'Start Extracting';
                extractBtn.classList.remove('active');
                status.textContent = '';
            } else {
                // Start extraction
                chrome.tabs.sendMessage(tabs[0].id, {action: 'startExtraction'});
                extractBtn.textContent = 'Stop Extracting';
                extractBtn.classList.add('active');
                status.textContent = 'Hover over elements and click to extract';
                
                // Close popup after a short delay
                setTimeout(() => {
                    window.close();
                }, 1000);
            }
        });
    });

    // Listen for extraction completion
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'extractionComplete') {
            extractBtn.textContent = 'Start Extracting';
            extractBtn.classList.remove('active');
            status.textContent = 'Content copied to clipboard!';
            
            setTimeout(() => {
                status.textContent = '';
            }, 2000);
        }
    });
});
