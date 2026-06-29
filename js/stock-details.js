document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const symbol = params.get("symbol") || "AAPL";

  const backLink = document.querySelector("#go-back");
  if (backLink) {
    backLink.addEventListener("click", (event) => {
      event.preventDefault();
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = "dashboard.html";
      }
    });
  }

  const header = document.querySelector(".stock-header");
  const companyContainer = document.querySelector(".company-info");

  const loading = document.createElement("p");
  loading.className = "stock-detail-name";
  loading.textContent = "Loading " + symbol + "...";
  header.appendChild(loading);

  let stock;
  try {
    stock = await fetchQuote(symbol);
  } catch (error) {
    header.innerHTML = "";
    header.appendChild(createErrorMessage(error.message, () => window.location.reload()));
    return;
  }

  header.innerHTML = "";

  const logo = document.createElement("img");
  logo.className = "stock-detail-logo";
  logo.src = "https://financialmodelingprep.com/image-stock/" + stock.symbol + ".png";
  logo.alt = "";
  logo.addEventListener("error", () => {
    logo.style.display = "none";
  });

  const info = document.createElement("div");
  info.className = "stock-detail-info";

  const symbolEl = document.createElement("p");
  symbolEl.className = "stock-detail-symbol";
  symbolEl.textContent = stock.symbol;

  const nameEl = document.createElement("p");
  nameEl.className = "stock-detail-name";
  nameEl.textContent = stock.name;

  const priceEl = document.createElement("p");
  priceEl.className = "stock-detail-price";
  priceEl.textContent = stock.price;

  const changeEl = document.createElement("span");
  changeEl.className =
    "stock-detail-change " + (stock.trend === "down" ? "text-loss" : "text-gain");
  changeEl.textContent = stock.change;

  info.appendChild(symbolEl);
  info.appendChild(nameEl);
  info.appendChild(priceEl);
  info.appendChild(changeEl);

  header.appendChild(logo);
  header.appendChild(info);

  if (companyContainer && stock.details) {
    Object.entries(stock.details).forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "company-row";

      const labelEl = document.createElement("span");
      labelEl.className = "company-label";
      labelEl.textContent = label;

      const valueEl = document.createElement("span");
      valueEl.className = "company-value";
      valueEl.textContent = value;

      row.appendChild(labelEl);
      row.appendChild(valueEl);
      companyContainer.appendChild(row);
    });
  }

  const isLoggedIn = () => localStorage.getItem("loggedIn") === "true";

  const watchlistBtn = document.querySelector("#watchlist-btn");
  if (watchlistBtn) {
    let currentUid = null;

    const updateButton = async () => {
      if (!currentUid) {
        watchlistBtn.textContent = "Add to Watchlist";
        return;
      }
      const inList = await fsIsWatchlisted(currentUid, stock.symbol);
      watchlistBtn.textContent = inList ? "Remove from Watchlist" : "Add to Watchlist";
    };

    auth.onAuthStateChanged((user) => {
      currentUid = user ? user.uid : null;
      updateButton();
    });

    watchlistBtn.addEventListener("click", async () => {
      if (!currentUid) {
        window.location.href = "login.html";
        return;
      }
      watchlistBtn.disabled = true;
      try {
        const inList = await fsIsWatchlisted(currentUid, stock.symbol);
        if (inList) {
          await fsRemoveFromWatchlist(currentUid, stock.symbol);
        } else {
          await fsAddToWatchlist(currentUid, stock.symbol);
        }
        await updateButton();
      } finally {
        watchlistBtn.disabled = false;
      }
    });
  }

  const buyShares = document.querySelector("#buy-shares");
  const buyBtn = document.querySelector("#buy-btn");
  const buyFeedback = document.querySelector("#buy-feedback");
  const currencyChar = stock.price.charAt(0);
  const priceNumber = parseFloat(stock.price.replace(/[^0-9.]/g, ""));
  let awaitingConfirm = false;

  buyBtn.addEventListener("click", () => {
    if (!isLoggedIn()) {
      window.location.href = "login.html";
      return;
    }

    const shares = parseFloat(buyShares.value);

    if (isNaN(shares) || shares <= 0) {
      buyFeedback.textContent = "Please enter a number of shares greater than 0.";
      buyFeedback.className = "buy-feedback text-loss";
      awaitingConfirm = false;
      buyBtn.textContent = "Buy";
      return;
    }

    if (!awaitingConfirm) {
      const total = (shares * priceNumber).toFixed(2);
      buyFeedback.textContent =
        "Buy " + shares + " shares of " + stock.symbol + " at " + stock.price +
        " for " + currencyChar + total + "? Click Confirm.";
      buyFeedback.className = "buy-feedback";
      buyBtn.textContent = "Confirm";
      awaitingConfirm = true;
      return;
    }

    const holdings = JSON.parse(localStorage.getItem("holdings") || "[]");
    holdings.push({ symbol: stock.symbol, shares: shares, price: priceNumber });
    localStorage.setItem("holdings", JSON.stringify(holdings));

    buyFeedback.textContent = "Bought " + shares + " shares of " + stock.symbol + ".";
    buyFeedback.className = "buy-feedback text-gain";
    buyBtn.textContent = "Buy";
    buyShares.value = "";
    awaitingConfirm = false;
  });
});