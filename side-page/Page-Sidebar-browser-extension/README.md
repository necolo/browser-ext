# Page Sidebar Browser Extension

A browser extension that adds a sidebar to web pages for enhanced browsing experience.

## Fork Information

This project is a fork of the original [Page Sidebar browser extension](https://github.com/turnoffthelights/Browser-Extensions/tree/master/Page-Sidebar/Page-Sidebar-browser-extension) from the [Browser-Extensions](https://github.com/turnoffthelights/Browser-Extensions) repository.

### Original Repository
- **Source**: [turnoffthelights/Browser-Extensions](https://github.com/turnoffthelights/Browser-Extensions)
- **Original Author**: Stefan Van Damme
- **License**: GPL-2.0

## About

This browser extension provides a sidebar functionality that can be used across different web browsers. The extension supports multiple browsers including Chrome, Firefox, Opera, Edge, Safari, Whale, and Yandex.

## Features

- Cross-browser compatibility
- Sidebar panel for enhanced browsing
- Multi-language support (50+ languages)
- Customizable options
- Modern UI design

## Installation

### Development Build

1. Clone this repository:
   ```bash
   git clone <your-fork-url>
   cd Page-Sidebar-browser-extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build for your preferred browser:
   ```bash
   # For Chrome
   npm run chrome
   
   # For Firefox
   npm run firefox
   
   # For Opera
   npm run opera
   
   # For Edge
   npm run edge
   
   # For Safari
   npm run safari
   
   # For Whale
   npm run whale
   
   # For Yandex
   npm run yandex
   ```

4. Load the extension in your browser from the `dist/[browser]` directory.

## Development

### Available Scripts

- `npm run lint` - Run ESLint on JavaScript files
- `npm run chrome` - Build for Chrome
- `npm run firefox` - Build for Firefox
- `npm run opera` - Build for Opera
- `npm run edge` - Build for Edge
- `npm run safari` - Build for Safari
- `npm run whale` - Build for Whale
- `npm run yandex` - Build for Yandex
- `npm run browserzip` - Create zip files for all browsers

### Project Structure

```
src/
├── _locales/          # Internationalization files
├── constants/         # Browser-specific constants
├── images/           # Extension icons and images
├── manifests/        # Browser manifest files
├── scripts/          # JavaScript source files
├── styles/           # CSS stylesheets
├── options.html      # Options page
├── panel.html        # Sidebar panel
└── schema.json       # Configuration schema
```

## Contributing

This is a fork of the original project. If you'd like to contribute to the original project, please visit the [original repository](https://github.com/turnoffthelights/Browser-Extensions).

For issues or contributions specific to this fork, please create an issue or pull request in this repository.

## License

This project is licensed under the GPL-2.0 License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Original project by [Stefan Van Damme](https://github.com/stefanvd)
- Maintained by [turnoffthelights](https://github.com/turnoffthelights)
- This fork maintains compatibility with the original project while allowing for independent development
