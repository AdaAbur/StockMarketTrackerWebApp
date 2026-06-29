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

  const feeRate = 0.001;
  const priceRaw = stock.priceRaw || parseFloat(stock.price.replace(/[^0-9.]/g, ""));

  let uid = null;
  let cashBalance = 0;
  let ownedQty = 0;
  let averageBuyPrice = 0;
  let mode = "buy";

  const tabBuy = document.querySelector("#tab-buy");
  const tabSell = document.querySelector("#tab-sell");
  const available = document.querySelector("#trade-available");
  const qtyInput = document.querySelector("#qty-input");
  const qtyMinus = document.querySelector("#qty-minus");
  const qtyPlus = document.querySelector("#qty-plus");
  const sumPrice = document.querySelector("#sum-price");
  const sumShares = document.querySelector("#sum-shares");
  const sumFee = document.querySelector("#sum-fee");
  const sumTotal = document.querySelector("#sum-total");
  const tradeBtn = document.querySelector("#trade-btn");
  const tradeFeedback = document.querySelector("#trade-feedback");
  const watchlistBtn = document.querySelector("#watchlist-btn");

  const updateAvailable = () => {
    if (!uid) {
      available.textContent = "Available: sign in to trade";
      return;
    }
    if (mode === "buy") {
      available.textContent = "Available: " + formatMoney(cashBalance);
    } else {
      available.textContent = "Available: " + ownedQty + " shares";
    }
  };

  const updateSummary = () => {
    const qty = parseFloat(qtyInput.value) || 0;
    const value = qty * priceRaw;
    const fee = value * feeRate;
    const total = mode === "buy" ? value + fee : value - fee;
    sumPrice.textContent = formatMoney(priceRaw);
    sumShares.textContent = qty;
    sumFee.textContent = formatMoney(fee);
    sumTotal.textContent = formatMoney(total);
  };

  const updateWatchlistButton = async () => {
    if (!watchlistBtn) return;
    if (!uid) {
      watchlistBtn.textContent = "Add to Watchlist";
      return;
    }
    const inList = await fsIsWatchlisted(uid, stock.symbol);
    watchlistBtn.textContent = inList ? "Remove from Watchlist" : "Add to Watchlist";
  };

  const setMode = (next) => {
    mode = next;
    tabBuy.classList.toggle("trade-tab-active", next === "buy");
    tabSell.classList.toggle("trade-tab-active", next === "sell");
    tradeBtn.textContent = next === "buy" ? "Buy" : "Sell";
    tradeBtn.classList.toggle("trade-btn-buy", next === "buy");
    tradeBtn.classList.toggle("trade-btn-sell", next === "sell");
    tradeFeedback.textContent = "";
    updateAvailable();
    updateSummary();
  };

  const refreshUserData = async () => {
    const data = await fsGetUserData(uid);
    cashBalance = data && typeof data.cashBalance === "number" ? data.cashBalance : 0;
    const holdings = await fsGetHoldings(uid);
    const holding = holdings.find((item) => item.symbol === stock.symbol);
    ownedQty = holding ? holding.quantity : 0;
    averageBuyPrice = holding ? holding.averageBuyPrice : 0;
  };

  tabBuy.addEventListener("click", () => setMode("buy"));
  tabSell.addEventListener("click", () => setMode("sell"));

  qtyMinus.addEventListener("click", () => {
    const value = parseFloat(qtyInput.value) || 0;
    qtyInput.value = Math.max(1, value - 1);
    updateSummary();
  });
  qtyPlus.addEventListener("click", () => {
    const value = parseFloat(qtyInput.value) || 0;
    qtyInput.value = value + 1;
    updateSummary();
  });
  qtyInput.addEventListener("input", updateSummary);

  tradeBtn.addEventListener("click", async () => {
    if (!uid) {
      window.location.href = "login.html";
      return;
    }
    const qty = parseFloat(qtyInput.value);
    if (isNaN(qty) || qty <= 0) {
      tradeFeedback.textContent = "Enter a quantity greater than 0.";
      tradeFeedback.className = "buy-feedback text-loss";
      return;
    }

    const value = qty * priceRaw;
    const fee = value * feeRate;
    tradeBtn.disabled = true;

    try {
      if (mode === "buy") {
        const total = value + fee;
        if (total > cashBalance) {
          tradeFeedback.textContent = "Insufficient balance.";
          tradeFeedback.className = "buy-feedback text-loss";
          return;
        }
        let newQty;
        let newAvg;
        if (ownedQty <= 0) {
          newQty = qty;
          newAvg = priceRaw;
        } else {
          const oldCost = ownedQty * averageBuyPrice;
          newQty = ownedQty + qty;
          newAvg = (oldCost + value) / newQty;
        }
        await fsSaveHolding(uid, { symbol: stock.symbol, quantity: newQty, averageBuyPrice: newAvg });
        cashBalance -= total;
        await fsUpdateCashBalance(uid, cashBalance);
        await fsSaveTransaction(uid, {
          type: "buy", symbol: stock.symbol, companyName: stock.name,
          quantity: qty, price: priceRaw, fee: fee, totalAmount: total
        });
        ownedQty = newQty;
        averageBuyPrice = newAvg;
        tradeFeedback.textContent = "Bought " + qty + " " + stock.symbol + " for " + formatMoney(total) + ".";
        tradeFeedback.className = "buy-feedback text-gain";
      } else {
        if (ownedQty <= 0) {
          tradeFeedback.textContent = "You don't own this stock.";
          tradeFeedback.className = "buy-feedback text-loss";
          return;
        }
        if (qty > ownedQty) {
          tradeFeedback.textContent = "You only have " + ownedQty + " shares.";
          tradeFeedback.className = "buy-feedback text-loss";
          return;
        }
        const proceeds = value - fee;
        const newQty = ownedQty - qty;
        if (newQty <= 0) {
          await fsDeleteHolding(uid, stock.symbol);
          ownedQty = 0;
          averageBuyPrice = 0;
        } else {
          await fsSaveHolding(uid, { symbol: stock.symbol, quantity: newQty, averageBuyPrice: averageBuyPrice });
          ownedQty = newQty;
        }
        cashBalance += proceeds;
        await fsUpdateCashBalance(uid, cashBalance);
        await fsSaveTransaction(uid, {
          type: "sell", symbol: stock.symbol, companyName: stock.name,
          quantity: qty, price: priceRaw, fee: fee, totalAmount: proceeds
        });
        tradeFeedback.textContent = "Sold " + qty + " " + stock.symbol + " for " + formatMoney(proceeds) + ".";
        tradeFeedback.className = "buy-feedback text-gain";
      }
      updateAvailable();
      updateSummary();
    } catch (error) {
      tradeFeedback.textContent = error.message;
      tradeFeedback.className = "buy-feedback text-loss";
    } finally {
      tradeBtn.disabled = false;
    }
  });

  if (watchlistBtn) {
    watchlistBtn.addEventListener("click", async () => {
      if (!uid) {
        window.location.href = "login.html";
        return;
      }
      watchlistBtn.disabled = true;
      try {
        const inList = await fsIsWatchlisted(uid, stock.symbol);
        if (inList) {
          await fsRemoveFromWatchlist(uid, stock.symbol);
        } else {
          await fsAddToWatchlist(uid, stock.symbol);
        }
        await updateWatchlistButton();
      } finally {
        watchlistBtn.disabled = false;
      }
    });
  }

  setMode("buy");
  loadCurrencyRates().then(updateSummary);

  auth.onAuthStateChanged(async (user) => {
    uid = user ? user.uid : null;
    if (uid) {
      await refreshUserData();
    }
    updateAvailable();
    updateSummary();
    updateWatchlistButton();
  });
});