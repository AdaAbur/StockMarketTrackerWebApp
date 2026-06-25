document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".watchlist-items");

  const getWatchlist = () => JSON.parse(localStorage.getItem("watchlist") || "[]");
  const saveWatchlist = (list) => localStorage.setItem("watchlist", JSON.stringify(list));

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

  const createCard = (stock) => {
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
    removeBtn.addEventListener("click", () => {
      const list = getWatchlist().filter((item) => item !== stock.symbol);
      saveWatchlist(list);
      card.remove();
      if (list.length === 0) {
        showMessage("Your watchlist is empty.", true);
      }
    });

    end.appendChild(priceBox);
    end.appendChild(removeBtn);

    card.appendChild(main);
    card.appendChild(end);
    return card;
  };

  const load = async () => {
    const symbols = getWatchlist();
    if (symbols.length === 0) {
      showMessage("Your watchlist is empty.", true);
      return;
    }

    showMessage("Loading...", false);
    try {
      const stocks = await fetchQuotes(symbols);
      container.innerHTML = "";
      stocks.forEach((stock) => container.appendChild(createCard(stock)));
    } catch (error) {
      container.innerHTML = "";
      container.appendChild(createErrorMessage(error.message, load));
    }
  };

  load();
});