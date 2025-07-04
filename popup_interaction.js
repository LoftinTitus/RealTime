const finnhubApiKey = 'd1jtvg1r01ql1h39esh0d1jtvg1r01ql1h39eshg';
const stockSymbol = 'AAPL';

const stockPriceEl = document.getElementById('stockPrice');
const newsListEl = document.getElementById('newsList');

async function fetchStockPrice(symbol) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubApiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data && data.c) {  // current price
      stockPriceEl.textContent = `${symbol}: $${data.c.toFixed(2)}`;
    } else {
      stockPriceEl.textContent = 'Stock data unavailable';
    }
  } catch (e) {
    stockPriceEl.textContent = 'Error fetching stock data';
    console.error(e);
  }
}

async function fetchFinancialNews(symbol) {
  const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=2023-01-01&to=2023-12-31&token=${finnhubApiKey}`;
  try {
    const res = await fetch(url);
    const articles = await res.json();

    newsListEl.innerHTML = '';
    if (articles.length > 0) {
      articles.slice(0, 5).forEach(article => {
        const li = document.createElement('li');
        li.textContent = article.headline;
        li.title = article.summary || '';
        li.style.cursor = 'pointer';
        li.onclick = () => chrome.tabs.create({ url: article.url });
        newsListEl.appendChild(li);
      });
    } else {
      newsListEl.innerHTML = '<li>No news available</li>';
    }
  } catch (e) {
    newsListEl.innerHTML = '<li>Error fetching news</li>';
    console.error(e);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  // Tab buttons
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all buttons and contents
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Add active to clicked button and matching content
      btn.classList.add('active');
      const tab = btn.getAttribute('data-tab');
      document.getElementById(tab).classList.add('active');
    });
  });

  // Your existing code to fetch and display data can stay here
  fetchStockPrice(stockSymbol);
  fetchFinancialNews(stockSymbol);
});
