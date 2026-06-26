document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("#stock-search-input");
  const countrySelect = document.querySelector("#country-select");
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
      const country = countrySelect.value;
      const filtered = country ? list.filter((item) => item.country === country) : list;
      if (filtered.length === 0) {
        setMessage("No stocks found.");
        return;
      }
      render(filtered.slice(0, 20));
    } catch (error) {
      results.innerHTML = "";
      results.appendChild(createErrorMessage(error.message, () => search(query)));
    }
  };

  const triggerSearch = () => {
    const query = input.value.trim();
    if (query === "") {
      results.innerHTML = "";
      return;
    }
    search(query);
  };

  input.addEventListener("input", () => {
    clearTimeout(timer);
    if (input.value.trim() === "") {
      results.innerHTML = "";
      return;
    }
    timer = setTimeout(triggerSearch, 400);
  });

  countrySelect.addEventListener("change", triggerSearch);
});