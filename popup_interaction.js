// Finnhub API Key
const FINNHUB_API_KEY = 'd1jtvg1r01ql1h39esh0d1jtvg1r01ql1h39eshg';

// Default settings
const DEFAULT_SETTINGS = {
  stockSymbol: 'AAPL',
  refreshInterval: 0,
  newsCount: 10
};

let currentSettings = { ...DEFAULT_SETTINGS };
let refreshTimer = null;

// Initialize the extension
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  setupTabNavigation();
  setupEventListeners();
  await initializeData();
});

// Load settings from Chrome storage
async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(DEFAULT_SETTINGS);
    currentSettings = { ...DEFAULT_SETTINGS, ...result };
    updateSettingsUI();
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

// Save settings to Chrome storage
async function saveSettings() {
  try {
    await chrome.storage.sync.set(currentSettings);
    showStatus('Settings saved successfully!', 'success');
    
    // Restart auto-refresh if enabled
    setupAutoRefresh();
    
    // Refresh data with new settings
    await fetchAndDisplayData();
  } catch (error) {
    console.error('Error saving settings:', error);
    showStatus('Error saving settings!', 'error');
  }
}

// Update settings UI with current values
function updateSettingsUI() {
  document.getElementById('stockInput').value = currentSettings.stockSymbol;
  document.getElementById('refreshInterval').value = currentSettings.refreshInterval;
  document.getElementById('newsCount').value = currentSettings.newsCount;
}

// Setup tab navigation
function setupTabNavigation() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const tab = btn.getAttribute('data-tab');
      document.getElementById(tab).classList.add('active');
    });
  });
}

// Setup event listeners
function setupEventListeners() {
  // Market data refresh
  document.getElementById('refreshData').addEventListener('click', fetchAndDisplayData);
  
  // News refresh and category change
  document.getElementById('refreshNews').addEventListener('click', () => fetchFinancialNews());
  document.getElementById('newsCategory').addEventListener('change', () => fetchFinancialNews());
  
  // Settings
  document.getElementById('saveSettings').addEventListener('click', handleSaveSettings);
  document.getElementById('resetSettings').addEventListener('click', handleResetSettings);
}

// Handle save settings
async function handleSaveSettings() {
  currentSettings.stockSymbol = document.getElementById('stockInput').value.trim().toUpperCase();
  currentSettings.refreshInterval = parseInt(document.getElementById('refreshInterval').value);
  currentSettings.newsCount = parseInt(document.getElementById('newsCount').value);
  
  if (!currentSettings.stockSymbol) {
    showStatus('Please enter a valid stock symbol!', 'error');
    return;
  }
  
  await saveSettings();
}

// Handle reset settings
async function handleResetSettings() {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    currentSettings = { ...DEFAULT_SETTINGS };
    updateSettingsUI();
    await saveSettings();
  }
}

// Show status message
function showStatus(message, type = 'info') {
  const statusEl = document.getElementById('settingsStatus');
  statusEl.textContent = message;
  statusEl.className = `status-message ${type}`;
  
  setTimeout(() => {
    statusEl.textContent = '';
    statusEl.className = 'status-message';
  }, 3000);
}

// Initialize data loading
async function initializeData() {
  await fetchAndDisplayData();
  setupAutoRefresh();
}

// Show message when no API key is set - removed since we have hardcoded key

// Fetch and display all data
async function fetchAndDisplayData() {
  await Promise.all([
    fetchStockPrice(currentSettings.stockSymbol),
    fetchFinancialNews()
  ]);
}

// Fetch stock price and market data
async function fetchStockPrice(symbol) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.c !== undefined) {
      updateMarketDataUI(symbol, data);
    } else {
      showMarketDataError('Stock data unavailable. Check symbol.');
    }
  } catch (error) {
    console.error('Error fetching stock data:', error);
    showMarketDataError('Error fetching stock data');
  }
}

// Update market data UI
function updateMarketDataUI(symbol, data) {
  const change = data.c - data.pc;
  const changePercent = ((change / data.pc) * 100);
  const isPositive = change >= 0;
  
  document.getElementById('stockSymbol').textContent = symbol;
  document.getElementById('currentPrice').textContent = `$${data.c.toFixed(2)}`;
  document.getElementById('priceChange').textContent = `${isPositive ? '+' : ''}$${change.toFixed(2)}`;
  document.getElementById('changePercent').textContent = `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%`;
  document.getElementById('highPrice').textContent = `$${data.h.toFixed(2)}`;
  document.getElementById('lowPrice').textContent = `$${data.l.toFixed(2)}`;
  document.getElementById('prevClose').textContent = `$${data.pc.toFixed(2)}`;
  document.getElementById('volume').textContent = data.v ? data.v.toLocaleString() : 'N/A';
  
  // Color coding for price changes
  const changeEl = document.getElementById('priceChange');
  const percentEl = document.getElementById('changePercent');
  const color = isPositive ? '#008000' : '#ff0000';
  changeEl.style.color = color;
  percentEl.style.color = color;
}

// Show market data error
function showMarketDataError(message) {
  document.getElementById('stockSymbol').textContent = 'Error';
  document.getElementById('currentPrice').textContent = message;
  ['priceChange', 'changePercent', 'highPrice', 'lowPrice', 'prevClose', 'volume'].forEach(id => {
    document.getElementById(id).textContent = '--';
  });
}

// Fetch financial news
async function fetchFinancialNews() {
  const category = document.getElementById('newsCategory').value;
  const to = new Date();
  const from = new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
  
  const fromStr = from.toISOString().split('T')[0];
  const toStr = to.toISOString().split('T')[0];
  
  let url;
  if (category === 'general') {
    url = `https://finnhub.io/api/v1/company-news?symbol=${currentSettings.stockSymbol}&from=${fromStr}&to=${toStr}&token=${FINNHUB_API_KEY}`;
  } else {
    url = `https://finnhub.io/api/v1/news?category=${category}&token=${FINNHUB_API_KEY}`;
  }

  try {
    const response = await fetch(url);
    const articles = await response.json();

    updateNewsUI(articles);
  } catch (error) {
    console.error('Error fetching news:', error);
    document.getElementById('newsList').innerHTML = '<li>Error fetching news</li>';
  }
}

// Update news UI
function updateNewsUI(articles) {
  const newsListEl = document.getElementById('newsList');
  newsListEl.innerHTML = '';

  if (articles && articles.length > 0) {
    articles.slice(0, currentSettings.newsCount).forEach(article => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="news-item">
          <div class="news-headline">${article.headline || 'No headline'}</div>
          <div class="news-source">${article.source || 'Unknown'} • ${formatDate(article.datetime)}</div>
          ${article.summary ? `<div class="news-summary">${article.summary.substring(0, 100)}...</div>` : ''}
        </div>
      `;
      li.style.cursor = 'pointer';
      li.onclick = () => {
        if (article.url) {
          chrome.tabs.create({ url: article.url });
        }
      };
      newsListEl.appendChild(li);
    });
  } else {
    newsListEl.innerHTML = '<li>No news available</li>';
  }
}

// Format date for news
function formatDate(timestamp) {
  if (!timestamp) return 'Unknown date';
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Setup auto refresh
function setupAutoRefresh() {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
  
  if (currentSettings.refreshInterval > 0) {
    refreshTimer = setInterval(() => {
      fetchAndDisplayData();
    }, currentSettings.refreshInterval * 1000);
  }
}
