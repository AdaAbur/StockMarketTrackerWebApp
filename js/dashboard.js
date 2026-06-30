const trendingSymbols = ["AAPL", "MSFT", "TSLA", "AMZN", "NVDA", "GOOGL"];

const isLoggedIn = () => localStorage.getItem("loggedIn") === "true";

function loadGreeting() {
  const welcomeLabel = document.querySelector(".dashboard-welcome");
  const greeting = document.querySelector("#dashboard-greeting");
  if (!greeting) return;
  if (isLoggedIn()) {
    const name = localStorage.getItem("userName");
    if (welcomeLabel) welcomeLabel.style.display = "";
    greeting.textContent = name ? name : "Welcome Back";
  } else {
    if (welcomeLabel) welcomeLabel.style.display = "none";
    greeting.textContent = "Welcome";
  }
}

function loadLocation() {
  const locationEl = document.querySelector("#dashboard-location");
  if (!locationEl) return;
  detectLocation((result) => {
    if (result && result.country) {
      const place = result.city ? result.city + ", " + result.country : result.country;
      locationEl.textContent = "Markets near you: " + place;
    } else {
      locationEl.textContent = "Location unavailable";
    }
  });
}

function createTxnCard(tx) {
  const card = document.createElement("div");
  card.className = "txn-card";

  let dateStr = "";
  if (tx.createdAt && tx.createdAt.toDate) {
    dateStr = tx.createdAt.toDate().toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }

  const type = document.createElement("span");
  type.className = "txn-type " + (tx.type === "sell" ? "text-loss" : "text-gain");
  type.textContent = (tx.type || "").toUpperCase() + " " + tx.symbol;

  const amount = document.createElement("span");
  amount.className = "txn-amount";
  amount.textContent = formatMoney(tx.totalAmount);

  const meta = document.createElement("span");
  meta.className = "txn-meta";
  meta.textContent = tx.quantity + " Shares · @" + formatMoney(tx.price);

  const date = document.createElement("span");
  date.className = "txn-date";
  date.textContent = dateStr;

  card.appendChild(type);
  card.appendChild(amount);
  card.appendChild(meta);
  card.appendChild(date);
  return card;
}

async function loadRecentTransactions(uid) {
  const container = document.querySelector("#recent-transactions");
  if (!container) return;

  if (!uid) {
    container.innerHTML = '<p class="txn-empty">Sign in to see your transactions. <a href="login.html">Sign in</a></p>';
    return;
  }

  container.innerHTML = '<p class="txn-empty">Loading...</p>';
  try {
    const txns = await fsGetTransactions(uid);
    if (!txns.length) {
      container.innerHTML = '<p class="txn-empty">No transactions yet.</p>';
      return;
    }
    const recent = txns.slice().reverse().slice(0, 10);
    container.innerHTML = "";
    recent.forEach((tx) => container.appendChild(createTxnCard(tx)));
  } catch (error) {
    container.innerHTML = '<p class="txn-empty">' + error.message + "</p>";
  }
}

async function loadTrendingStocks(container) {
  if (!container) return;
  container.innerHTML = '<p class="stocks-loading">Loading...</p>';
  try {
    const quotes = await fetchQuotes(trendingSymbols);
    container.innerHTML = "";
    quotes.forEach((stock) => {
      container.appendChild(createStockRow({ ...stock, href: "stock-details.html?symbol=" + stock.symbol }));
    });
  } catch (error) {
    container.innerHTML = "";
    container.appendChild(createErrorMessage(error.message, () => loadTrendingStocks(container)));
  }
}

async function loadDashboardNews(container) {
  if (!container) return;
  container.innerHTML = '<p class="stocks-loading">Loading news...</p>';
  try {
    const items = await fetchNews();
    container.innerHTML = "";
    items.slice(0, 6).forEach((item) => {
      const card = document.createElement("a");
      card.className = "dashboard-news-item";
      card.href = item.url;
      card.target = "_blank";
      card.rel = "noopener";

      if (item.image) {
        const thumb = document.createElement("img");
        thumb.className = "dashboard-news-thumb";
        thumb.src = item.image;
        thumb.alt = "";
        card.appendChild(thumb);
      }

      const body = document.createElement("div");
      body.className = "dashboard-news-body";

      const headline = document.createElement("p");
      headline.className = "dashboard-news-headline";
      headline.textContent = item.headline;

      const source = document.createElement("span");
      source.className = "dashboard-news-source";
      source.textContent = item.source;

      body.appendChild(headline);
      body.appendChild(source);
      card.appendChild(body);
      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = "";
    container.appendChild(createErrorMessage(error.message, () => loadDashboardNews(container)));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  sessionStorage.setItem("enteredApp", "true");
  loadCurrencyRates();

  loadGreeting();
  loadLocation();
  loadTrendingStocks(document.querySelector(".trending-stocks"));
  loadDashboardNews(document.querySelector(".dashboard-news"));

  auth.onAuthStateChanged((user) => {
    const uid = (user && isLoggedIn()) ? user.uid : null;
    loadRecentTransactions(uid);
  });
});