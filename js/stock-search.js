document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("#stock-search-input");
  const results = document.querySelector(".stock-results");
  let timer;

  const setMessage = (text) => {
    results.innerHTML = "";
    const message = document.createElement("p");
    message.className = "search-message";
    message.textContent = text;
    results.appendChild(message);
  };

  const render = (list) => {
    results.innerHTML = "";
    list.forEach((stock) => {
      results.appendChild(
        createStockRow({
          symbol: stock.symbol,
          name: stock.name,
          href: "stock-details.html?symbol=" + stock.symbol
        })
      );
    });
  };

  const search = async (query) => {
    setMessage("Searching...");
    try {
      const list = await searchSymbols(query);
      if (list.length === 0) {
        setMessage("No stocks found.");
        return;
      }
      render(list.slice(0, 20));
    } catch (error) {
      setMessage(error.message);
    }
  };

  input.addEventListener("input", () => {
    const query = input.value.trim();
    clearTimeout(timer);
    if (query === "") {
      results.innerHTML = "";
      return;
    }
    timer = setTimeout(() => search(query), 400);
  });
});