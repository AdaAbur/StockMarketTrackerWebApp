document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".watchlist-items");

  const showMessage = (text, withLink) => {
    container.innerHTML = "";
    const message = document.createElement("p");
    message.className = "watchlist-message";
    message.textContent = text;
    if (withLink) {
      const link = document.createElement("a");
      link.href = "stock-search.html";
      link.textContent = "Find stocks";
      message.appendChild(document.createElement("br"));
      message.appendChild(link);
    }
    container.appendChild(message);
  };

  const createCard = (stock, uid) => {
    const card = document.createElement("div");
    card.className = "watchlist-card";

    const main = document.createElement("div");
    main.className = "watchlist-main";

    const symbol = document.createElement("a");
    symbol.className = "watchlist-symbol";
    symbol.href = "stock-details.html?symbol=" + stock.symbol;
    symbol.textContent = stock.symbol;

    const name = document.createElement("span");
    name.className = "watchlist-name";
    name.textContent = stock.name;

    main.appendChild(symbol);
    main.appendChild(name);

    const end = document.createElement("div");
    end.className = "watchlist-end";

    const priceBox = document.createElement("div");
    priceBox.className = "watchlist-price-box";

    const price = document.createElement("span");
    price.className = "watchlist-price";
    price.textContent = stock.price;

    const change = document.createElement("span");
    change.className = "watchlist-change " + (stock.trend === "down" ? "text-loss" : "text-gain");
    change.textContent = stock.change;

    priceBox.appendChild(price);
    priceBox.appendChild(change);

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", async () => {
      removeBtn.disabled = true;
      try {
        await fsRemoveFromWatchlist(uid, stock.symbol);
        card.remove();
        if (!container.querySelector(".watchlist-card")) {
          showMessage("Your watchlist is empty.", true);
        }
      } catch (error) {
        removeBtn.disabled = false;
      }
    });

    end.appendChild(priceBox);
    end.appendChild(removeBtn);

    card.appendChild(main);
    card.appendChild(end);
    return card;
  };

  const load = async (uid) => {
    showMessage("Loading...", false);

    let symbols;
    try {
      symbols = await fsGetWatchlist(uid);
    } catch (error) {
      container.innerHTML = "";
      container.appendChild(createErrorMessage(error.message, () => load(uid)));
      return;
    }

    if (symbols.length === 0) {
      showMessage("Your watchlist is empty.", true);
      return;
    }

    try {
      const stocks = await fetchQuotes(symbols);
      container.innerHTML = "";
      stocks.forEach((stock) => container.appendChild(createCard(stock, uid)));
    } catch (error) {
      container.innerHTML = "";
      container.appendChild(createErrorMessage(error.message, () => load(uid)));
    }
  };

  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }
    load(user.uid);
  });
});