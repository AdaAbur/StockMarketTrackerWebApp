const newsSymbols = ["AAPL", "MSFT", "TSLA", "AMZN", "NVDA", "GOOGL", "META", "NFLX"];

function renderTicker(container, stocks) {
  container.innerHTML = "";
  stocks.forEach((stock) => {
    const chip = document.createElement("a");
    chip.className = "news-chip";
    chip.href = "stock-details.html?symbol=" + stock.symbol;

    const symbol = document.createElement("span");
    symbol.className = "news-chip-symbol";
    symbol.textContent = stock.symbol;

    const price = document.createElement("span");
    price.className = "news-chip-price";
    price.textContent = stock.price;

    const change = document.createElement("span");
    change.className = "news-chip-change " + (stock.trend === "down" ? "text-loss" : "text-gain");
    change.textContent = stock.change;

    chip.appendChild(symbol);
    chip.appendChild(price);
    chip.appendChild(change);
    container.appendChild(chip);
  });
}

function renderNews(container, items) {
  container.innerHTML = "";
  items.forEach((item) => {
    const card = document.createElement("a");
    card.className = "news-card";
    card.href = item.url;
    card.target = "_blank";
    card.rel = "noopener";

    if (item.image) {
      const thumb = document.createElement("img");
      thumb.className = "news-thumb";
      thumb.src = item.image;
      thumb.alt = "";
      card.appendChild(thumb);
    }

    const content = document.createElement("div");
    content.className = "news-content";

    const headline = document.createElement("p");
    headline.className = "news-headline";
    headline.textContent = item.headline;

    const summary = document.createElement("p");
    summary.className = "news-summary";
    summary.textContent = item.summary;

    const source = document.createElement("span");
    source.className = "news-source";
    source.textContent = item.source;

    content.appendChild(headline);
    content.appendChild(summary);
    content.appendChild(source);
    card.appendChild(content);
    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const tickerContainer = document.querySelector(".news-ticker");
  const newsContainer = document.querySelector(".news-list");

  const loadTicker = async () => {
    tickerContainer.innerHTML = "";
    const loading = document.createElement("p");
    loading.className = "news-message";
    loading.textContent = "Loading...";
    tickerContainer.appendChild(loading);
    try {
      const stocks = await fetchQuotes(newsSymbols);
      renderTicker(tickerContainer, stocks);
    } catch (error) {
      tickerContainer.innerHTML = "";
      tickerContainer.appendChild(createErrorMessage(error.message, loadTicker));
    }
  };

  const loadNews = async () => {
    newsContainer.innerHTML = "";
    const loading = document.createElement("p");
    loading.className = "news-message";
    loading.textContent = "Loading news...";
    newsContainer.appendChild(loading);
    try {
      const items = await fetchNews();
      if (items.length === 0) {
        newsContainer.innerHTML = "";
        const message = document.createElement("p");
        message.className = "news-message";
        message.textContent = "No news available.";
        newsContainer.appendChild(message);
        return;
      }
      renderNews(newsContainer, items);
    } catch (error) {
      newsContainer.innerHTML = "";
      newsContainer.appendChild(createErrorMessage(error.message, loadNews));
    }
  };

  loadTicker();
  loadNews();
});