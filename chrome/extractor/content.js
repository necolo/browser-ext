class ElementExtractor {
    constructor() {
        this.isActive = false;
        this.currentHighlighted = null;
        this.boundHandlers = {
            mouseover: this.handleMouseOver.bind(this),
            mouseout: this.handleMouseOut.bind(this),
            click: this.handleClick.bind(this),
            keydown: this.handleKeyDown.bind(this)
        };
    }

    startExtraction() {
        if (this.isActive) return;
        
        this.isActive = true;
        document.body.style.cursor = 'crosshair';
        
        // Add event listeners
        document.addEventListener('mouseover', this.boundHandlers.mouseover, true);
        document.addEventListener('mouseout', this.boundHandlers.mouseout, true);
        document.addEventListener('click', this.boundHandlers.click, true);
        document.addEventListener('keydown', this.boundHandlers.keydown, true);
        
        // Show notification that extraction is active
        this.showNotification('Element extraction is now active');
        
        console.log('Element extraction started');
    }

    stopExtraction() {
        if (!this.isActive) return;
        
        this.isActive = false;
        document.body.style.cursor = '';
        
        // Remove event listeners
        document.removeEventListener('mouseover', this.boundHandlers.mouseover, true);
        document.removeEventListener('mouseout', this.boundHandlers.mouseout, true);
        document.removeEventListener('click', this.boundHandlers.click, true);
        document.removeEventListener('keydown', this.boundHandlers.keydown, true);
        
        // Clean up highlighting
        this.removeHighlight();
        
        // Show notification that extraction is stopped
        this.showNotification('Element extraction stopped');
        
        console.log('Element extraction stopped');
    }

    handleMouseOver(event) {
        if (!this.isActive) return;
        
        event.stopPropagation();
        event.preventDefault();
        
        this.removeHighlight();
        this.highlightElement(event.target);
    }

    handleMouseOut(event) {
        if (!this.isActive) return;
        
        event.stopPropagation();
        event.preventDefault();
    }

    handleClick(event) {
        if (!this.isActive) return;
        
        event.stopPropagation();
        event.preventDefault();
        
        this.extractElement(event.target);
    }

    handleKeyDown(event) {
        if (!this.isActive) return;
        
        // ESC key to cancel
        if (event.key === 'Escape') {
            event.stopPropagation();
            event.preventDefault();
            this.showNotification('Element extraction cancelled');
            this.stopExtraction();
        }
    }

    highlightElement(element) {
        if (!element || element === document.body || element === document.documentElement) return;
        
        this.currentHighlighted = element;
        element.classList.add('element-extractor-highlight');
    }

    removeHighlight() {
        if (this.currentHighlighted) {
            this.currentHighlighted.classList.remove('element-extractor-highlight');
            this.currentHighlighted.classList.remove('element-extractor-extracting');
            this.currentHighlighted = null;
        }
    }

    isElementHidden(element) {
        if (!element) return false;
        
        // Get computed styles
        const computedStyle = window.getComputedStyle(element);
        
        // Check for common ways elements can be hidden
        const isDisplayNone = computedStyle.display === 'none';
        const isVisibilityHidden = computedStyle.visibility === 'hidden';
        const isOpacityZero = parseFloat(computedStyle.opacity) === 0;

        // Check if element or any parent has display: none
        // let parent = element.parentElement;
        // let parentHidden = false;
        // while (parent && parent !== document.body) {
        //     const parentStyle = window.getComputedStyle(parent);
        //     if (parentStyle.display === 'none') {
        //         parentHidden = true;
        //         break;
        //     }
        //     parent = parent.parentElement;
        // }
        
        const isHidden = isDisplayNone || isVisibilityHidden || isOpacityZero;
        if (isHidden) this.showNotification(`Hidden: ${element.textContent}`);
        return isHidden;
    }

    getElementStyles(element) {
        if (!element) return null;
        
        const computedStyle = window.getComputedStyle(element);
        const styles = {};
        
        // Get relevant visibility-related styles
        const visibilityStyles = [
            'display', 'visibility', 'opacity', 'width', 'height',
            'max-width', 'max-height', 'min-width', 'min-height',
            'position', 'top', 'left', 'right', 'bottom', 'z-index'
        ];
        
        visibilityStyles.forEach(prop => {
            styles[prop] = computedStyle[prop];
        });
        
        // Add element dimensions
        styles.dimensions = {
            offsetWidth: element.offsetWidth,
            offsetHeight: element.offsetHeight,
            clientWidth: element.clientWidth,
            clientHeight: element.clientHeight,
            scrollWidth: element.scrollWidth,
            scrollHeight: element.scrollHeight
        };
        
        // Add bounding rect
        const rect = element.getBoundingClientRect();
        styles.boundingRect = {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
        };
        
        return styles;
    }

    // Debug method to log element visibility information
    debugElementVisibility(element) {
        if (!element) {
            console.log('Element is null or undefined');
            return;
        }

        const styles = this.getElementStyles(element);
        const isHidden = this.isElementHidden(element);
        
        console.group(`Element Visibility Debug: ${element.tagName}`);
        console.log('Is Hidden:', isHidden);
        console.log('Display:', styles.display);
        console.log('Visibility:', styles.visibility);
        console.log('Opacity:', styles.opacity);
        console.log('Dimensions:', styles.dimensions);
        console.log('Bounding Rect:', styles.boundingRect);
        console.groupEnd();
    }

    extractElement(element) {
        if (!element) return;
        
        // Add extraction animation
        element.classList.remove('element-extractor-highlight');
        element.classList.add('element-extractor-extracting');
        
        // Extract and format content
        const extractedContent = this.formatElementForLLM(element);
        
        // Copy to clipboard
        this.copyToClipboard(extractedContent);
        
        // Show notification
        this.showNotification('Content copied to clipboard!');
        
        // Clean up and stop
        setTimeout(() => {
            this.stopExtraction();
            
            // Notify popup
            chrome.runtime.sendMessage({action: 'extractionComplete'});
        }, 500);
    }

    formatElementForLLM(element) {
        const result = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            title: document.title,
            element: {}
        };

        // Get element information
        result.element.tagName = element.tagName.toLowerCase();
        result.element.className = element.className || '';
        result.element.id = element.id || '';
        
        // Get element position and context
        const rect = element.getBoundingClientRect();
        result.element.position = {
            x: Math.round(rect.left),
            y: Math.round(rect.top),
            width: Math.round(rect.width),
            height: Math.round(rect.height)
        };

        // Extract text content with structure preservation
        result.element.textContent = this.extractStructuredText(element);

        // Format for LLM consumption
        return this.formatForLLM(result);
    }

    extractStructuredText(element) {
        // const clone = element.cloneNode(true);
        
        // Remove script and style elements
        // const unwanted = clone.querySelectorAll('script, style, noscript');
        // unwanted.forEach(el => el.remove());
        
        // Process different element types
        const textParts = [];
        
        this.processElementForText(element, textParts, 0);
        
        return textParts.join('\n').trim();
    }

    processElementForText(element, textParts, depth) {
        if (this.isElementHidden(element)) return;

        const indent = '  '.repeat(depth);
        
        // Handle different element types
        switch (element.tagName?.toLowerCase()) {
            case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6':
                textParts.push(`${indent}# ${element.textContent.trim()}`);
                return;
            
            case 'p':
                textParts.push(`${indent}${element.textContent.trim()}`);
                return;
            
            case 'li':
                textParts.push(`${indent}- ${element.textContent.trim()}`);
                return;
            
            case 'blockquote':
                textParts.push(`${indent}> ${element.textContent.trim()}`);
                return;
            
            case 'code':
                textParts.push(`${indent}\`${element.textContent.trim()}\``);
                return;
            
            case 'pre':
                textParts.push(`${indent}\`\`\`\n${element.textContent}\n${indent}\`\`\``);
                return;
            
            case 'a':
                const href = element.href;
                const text = element.textContent.trim();
                textParts.push(`${indent}[${text}](${href})`);
                return;
            
            case 'img':
                const alt = element.alt || 'Image';
                const src = element.src;
                textParts.push(`${indent}![${alt}](${src})`);
                return;
        }
        
        // For other elements, process children
        if (element.children && element.children.length > 0) {
            for (let child of element.children) {
                this.processElementForText(child, textParts, depth + 1);
            }
        } else if (element.textContent && element.textContent.trim()) {
            textParts.push(`${indent}${element.textContent.trim()}`);
        }
    }

    getElementContext(element) {
        const context = {
            parent: null,
            siblings: [],
            children: element.children.length
        };

        // Get parent info
        if (element.parentElement && element.parentElement !== document.body) {
            context.parent = {
                tagName: element.parentElement.tagName.toLowerCase(),
                className: element.parentElement.className || '',
                id: element.parentElement.id || ''
            };
        }

        // Get sibling info (up to 3 before and after)
        const siblings = Array.from(element.parentElement?.children || []);
        const currentIndex = siblings.indexOf(element);
        
        context.siblings = siblings.slice(
            Math.max(0, currentIndex - 3), 
            currentIndex + 4
        ).map(sibling => ({
            tagName: sibling.tagName.toLowerCase(),
            isCurrent: sibling === element,
            textLength: sibling.textContent.length
        }));

        return context;
    }

    formatForLLM(data) {
        const formatted = [];
        formatted.push(data.element.textContent);
        return formatted.join('\n');
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
            
            // Fallback method
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.top = '-1000px';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'element-extractor-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    getStatus() {
        return { isActive: this.isActive };
    }
}

// Initialize the extractor
const extractor = new ElementExtractor();

// Listen for messages from popup and background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case 'startExtraction':
            extractor.startExtraction();
            break;
        
        case 'stopExtraction':
            extractor.stopExtraction();
            break;
        
        case 'getStatus':
            sendResponse(extractor.getStatus());
            break;
    }
});
