# FinWatch - Financial Market Tracker Chrome Extension

A comprehensive Chrome extension that provides real-time stock prices and financial news using the Finnhub API with advanced settings and preferences.

---

## Features

### Market Data
- Real-time stock quotes with current price, change, and percentage change
- Daily high/low prices and volume information
- Previous close price tracking
- Color-coded price changes (green for gains, red for losses)
- Configurable auto-refresh intervals
- Manual refresh button for instant updates

### Financial News
- Company-specific news for tracked stocks
- General financial news by category (General, Forex, Crypto, Mergers)
- Configurable number of articles to display (5-20)
- Click to open full articles in new tabs
- Recent news from the past 7 days with timestamps
- News source and summary previews

### Settings & Preferences
- Secure API key storage (users provide their own Finnhub API key)
- Configurable default stock symbol
- Auto-refresh intervals (30 seconds to 10 minutes, or manual only)
- Customizable number of news articles (5-20)
- Easy reset to default settings
- Settings validation and status messages

---

## Tech Stack

- **HTML + CSS** — Modern responsive popup UI with tabbed navigation
- **Vanilla JavaScript (ES6+)** — Async/await, Chrome APIs, local storage
- **Manifest V3** — Latest Chrome extension framework
- **Finnhub API** — Real-time market data & financial news
- **Chrome Storage API** — Secure, synced user preferences
- **Chrome Tabs API** — Open news articles in new tabs

---

## Setup Instructions

### 1. Add Icons (Required)
Create the following icon files in the `icons/` directory:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels) 
- `icon128.png` (128x128 pixels)

### 2. Install the Extension
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select this folder
4. The extension should now appear in your Chrome toolbar

### 3. Get a Finnhub API Key
1. Go to [Finnhub.io](https://finnhub.io/) and sign up for a free account
2. Navigate to your dashboard and copy your API key
3. Keep this key secure - you'll need it for the extension setup

### 4. Configure the Extension
1. Click the extension icon in your toolbar
2. Go to the "Settings" tab
3. Enter your Finnhub API key in the "API Key" field
4. Set your preferred stock symbol (e.g., AAPL, TSLA, GOOGL)
5. Configure other preferences as desired
6. Click "Save Settings"

---

## Usage

- **Market Data Tab**: View comprehensive real-time stock information
- **News Tab**: Browse financial news with category filters and refresh options
- **Settings Tab**: Configure your Finnhub API key, stock symbol, refresh rates, and preferences

---

## Troubleshooting

### "Stock data unavailable" error
- Check that the stock symbol is valid (e.g., AAPL for Apple)
- Try refreshing the data manually
- Check your internet connection

### News not loading
- Verify your internet connection
- Try switching news categories
- Use the manual refresh button

---

## API Rate Limits

The free Finnhub API includes:
- 60 API calls per minute
- 30 calls per second

The extension respects these limits with reasonable refresh intervals.

---

## Recent Improvements

### Completed 
- [X] Advanced settings panel with persistent storage
- [X] Comprehensive market data display (volume, high/low, etc.)
- [X] Enhanced news display with sources and timestamps
- [X] Auto-refresh functionality with configurable intervals
- [X] Color-coded price changes and improved UI
- [X] Error handling and status messages
- [X] News category filtering
- [X] Secure API key storage
- [X] Settings validation and reset functionality

### Upcoming Features 🚀
- [ ] Watchlist for multiple stocks
- [ ] Price alerts and notifications
- [ ] Mini stock charts/sparklines
- [ ] Dark mode theme
- [ ] Export/import settings
- [ ] Portfolio tracking
- [ ] Cryptocurrency support expansion  


