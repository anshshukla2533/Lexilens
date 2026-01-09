#  Word Info Extension

A Chrome extension that provides instant Wikipedia information about any word you select on the web.
You dont even to search , you just need to select and press ctrl+shift+y it will automatically give the result
It is solving the the need of changing a tab to get a inofmration about soemhting .
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green?logo=googlechrome)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)

##  Features

- **Instant Word Lookup** - Select any word on a webpage to get instant Wikipedia information
- **Context Menu Integration** - Right-click on selected text to search for information
- **Keyboard Shortcut** - Use `Ctrl+Shift+Y` (or `Cmd+Shift+Y` on Mac) to search from clipboard
- **Clean UI** - Beautiful popup with word definitions, descriptions, and thumbnails
- **Caching** - Smart caching system to reduce API calls and improve performance
- **Works Everywhere** - Compatible with all websites

## Installation

### From Source (Developer Mode)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chrome_extension/MyChromExtension/chrome_extension
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder from the project

##  Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

### Project Structure

```
chrome_extension/
├── public/
│   ├── manifest.json      # Extension manifest (V3)
│   └── icons/             # Extension icons
├── src/
│   ├── background/        # Service worker scripts
│   │   └── background.js
│   ├── content/           # Content scripts (injected into pages)
│   │   ├── ContentScript.jsx
│   │   ├── InfoBox.jsx
│   │   └── content.css
│   ├── popup/             # Extension popup UI
│   │   ├── Popup.jsx
│   │   └── Popup.css
│   ├── components/        # Reusable React components
│   │   ├── WordDefinition.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorMessage.jsx
│   ├── services/          # API services
│   │   └── api.js         # Wikipedia API integration
│   ├── utils/             # Utility functions
│   │   └── storage.js
│   └── styles/            # Global styles
│       └── global.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

##  Usage

### Method 1: Text Selection
1. Select any single word on a webpage
2. An info box will appear below the selection with Wikipedia information

### Method 2: Context Menu
1. Select text on a webpage
2. Right-click and select "Search Word Info"
3. View the information in the popup

### Method 3: Keyboard Shortcut
1. Copy a word to your clipboard
2. Press `Ctrl+Shift+Y` (Windows/Linux) or `Cmd+Shift+Y` (Mac)
3. The extension will search for the copied word

### Method 4: Popup
1. Click the extension icon in the toolbar
2. Enter a word in the search box
3. View the definition and information

## 🔧 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Chrome Extension Manifest V3** - Latest extension API
- **Wikipedia API** - Data source for word information

##  Permissions

The extension requires the following permissions:

| Permission | Purpose |
|------------|---------|
| `storage` | Save user preferences and cache |
| `activeTab` | Access the current tab for content injection |
| `contextMenus` | Add right-click menu options |
| `scripting` | Inject content scripts dynamically |

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Acknowledgments

- [Wikipedia API](https://www.mediawiki.org/wiki/REST_API) for providing word information
- [Vite](https://vitejs.dev/) for the blazing fast build tool
- [React](https://reactjs.org/) for the UI framework
