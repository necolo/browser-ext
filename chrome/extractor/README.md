# Element Extractor Chrome Extension

A Chrome extension that allows you to select webpage elements and extract their content in an LLM-optimized format.

## Features

1. **Element Selection**: Click the extension icon and hover over any webpage element
2. **Visual Highlighting**: Elements are highlighted with a red border as you hover
3. **Content Extraction**: Click on an element to extract its content and structure
4. **LLM-Optimized Format**: Extracted content is formatted specifically for use with Large Language Models
5. **Automatic Clipboard Copy**: Extracted content is automatically copied to your clipboard

## Installation

1. Clone or download this repository
2. Create the required icon files (see Icons section below)
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" in the top right
5. Click "Load unpacked" and select this extension's folder

## Icons

You need to create the following PNG icon files in the `icons/` directory:
- `icon16.png` (16x16 pixels)
- `icon32.png` (32x32 pixels) 
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

### Creating Icons

You can create icons using any image editor. The recommended design is a target/crosshair symbol on a gradient background:

1. **Background**: Linear gradient from #667eea to #764ba2
2. **Symbol**: White target/crosshair icon
3. **Style**: Modern, clean design

Alternatively, you can use online icon generators or convert from SVG to PNG.

## Usage

1. Click the extension icon in your Chrome toolbar
2. Click the "Start Extracting" button
3. Navigate to any webpage
4. Hover over elements you want to extract - they'll be highlighted with a red border
5. Click on the element you want to extract
6. The content will be automatically copied to your clipboard in LLM-optimized format
7. Press ESC to cancel extraction mode at any time

## Output Format

The extracted content includes:

- **Page Information**: Title, URL, timestamp
- **Element Details**: Tag name, ID, classes, position
- **Attributes**: Relevant attributes like href, src, alt, data-*, aria-*
- **Context**: Parent element info and sibling structure  
- **Structured Content**: Text content with markdown-like formatting
- **Hierarchy**: Preserved heading structure, lists, links, etc.

## Example Output

```
=== EXTRACTED WEBPAGE ELEMENT ===
Page: Example Website
URL: https://example.com
Extracted: 2024-01-15T10:30:45.123Z

--- Element Details ---
Tag: <div>
ID: main-content
Classes: container article-body
Position: 50x120 (800×600)

--- Content ---
# Main Article Title
This is the main content of the article with proper formatting.

- List item 1
- List item 2

[Link to more info](https://example.com/more)

=== END EXTRACTION ===
```

## Development

The extension consists of:

- `manifest.json`: Extension configuration
- `popup.html/js`: Extension popup interface
- `content.js/css`: Webpage interaction and element highlighting
- `background.js`: Service worker for coordination

## Permissions

- `activeTab`: Access to the current tab for element extraction
- `scripting`: Inject content scripts for element interaction

## Browser Compatibility

- Chrome (Manifest V3)
- Edge (Chromium-based)
- Other Chromium-based browsers

## License

MIT License - feel free to modify and distribute.
