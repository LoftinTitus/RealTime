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
  fetchStockPrice(stockSymbol);
  fetchFinancialNews(stockSymbol);
});

