const defaultStocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "MSFT", name: "Microsoft Corp." },
  { symbol: "NFLX", name: "Netflix Inc." },
  { symbol: "NVDA", name: "NVIDIA Corp." },
  { symbol: "TSLA", name: "Tesla Inc." }
];

const countries = [
  { value: "", label: "All countries" },
  { value: "United States", label: "United States" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Germany", label: "Germany" },
  { value: "France", label: "France" },
  { value: "Turkey", label: "Turkey" },
  { value: "Japan", label: "Japan" },
  { value: "Canada", label: "Canada" },
  { value: "India", label: "India" }
];

const sortOptions = [
  { value: "az", label: "A–Z" },
  { value: "za", label: "Z–A" },
  { value: "gainers", label: "Top Gainers" },
  { value: "losers", label: "Top Losers" },
  { value: "movers", label: "Biggest Movers" },
  { value: "recent", label: "Recently Viewed" }
];

const rankedModes = ["gainers", "losers", "movers"];

document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("#stock-search-input");
  const results = document.querySelector(".stock-results");
  const dropdown = document.querySelector("#country-dropdown");
  const toggle = document.querySelector("#country-toggle");
  const menu = document.querySelector("#country-menu");
  const sortDropdown = document.querySelector("#sort-dropdown");
  const sortToggle = document.querySelector("#sort-toggle");
  const sortMenu = document.querySelector("#sort-menu");
  let timer;
  let selectedCountry = "";
  let selectedSort = "az";

  const setMessage = (text) => {
    results.innerHTML = "";
    const message = document.createElement("p");
    message.className = "search-message";
    message.textContent = text;
    results.appendChild(message);
  };

  const rememberRecent = (symbol) => {
    try {
      const recents = JSON.parse(localStorage.getItem("recentStocks") || "[]").filter((item) => item !== symbol);
      recents.unshift(symbol);
      localStorage.setItem("recentStocks", JSON.stringify(recents.slice(0, 20)));
    } catch (error) {}
  };

  const render = (list) => {
    results.innerHTML = "";
    list.forEach((stock) => {
      const row = createStockRow({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price || "",
        change: stock.change,
        trend: stock.trend,
        href: "stock-details.html?symbol=" + stock.symbol
      });
      row.addEventListener("click", () => rememberRecent(stock.symbol));
      results.appendChild(row);
    });
  };

  const sortList = (list) => {
    const sorted = list.slice().sort((a, b) => a.symbol.localeCompare(b.symbol));
    return selectedSort === "za" ? sorted.reverse() : sorted;
  };

  const dedupe = (list) => {
    const seen = {};
    return list.filter((item) => {
      if (seen[item.symbol]) return false;
      seen[item.symbol] = true;
      return true;
    });
  };

  const fetchStocksByCountry = async (country) => {
    const url = new URL(API_CONFIG.baseUrl + "/stocks");
    if (country) url.searchParams.append("country", country);
    url.searchParams.append("apikey", API_CONFIG.apiKey);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network error. Please try again.");
    }
    const data = await response.json();
    if (data.status === "error") {
      throw new Error(data.message || "Could not load stocks.");
    }
    return (data.data || []).map((item) => ({
      symbol: item.symbol,
      name: item.name,
      country: item.country || ""
    }));
  };

  const loadDefaultList = async () => {
    if (!selectedCountry) {
      render(sortList(defaultStocks));
      return;
    }
    setMessage("Loading stocks...");
    try {
      const list = await fetchStocksByCountry(selectedCountry);
      const cleaned = sortList(dedupe(list)).slice(0, 30);
      if (cleaned.length === 0) {
        setMessage("No stocks found.");
        return;
      }
      render(cleaned);
    } catch (error) {
      results.innerHTML = "";
      results.appendChild(createErrorMessage(error.message, loadDefaultList));
    }
  };

  const loadRanked = async (mode) => {
    setMessage("Loading...");
    try {
      let symbols;
      if (selectedCountry) {
        const list = await fetchStocksByCountry(selectedCountry);
        symbols = dedupe(list).slice(0, 8).map((stock) => stock.symbol);
      } else {
        symbols = defaultStocks.map((stock) => stock.symbol);
      }
      if (symbols.length === 0) {
        setMessage("No stocks found.");
        return;
      }
      const quotes = await fetchQuotes(symbols);
      const sorted = quotes.slice();
      if (mode === "gainers") {
        sorted.sort((a, b) => parseFloat(b.change) - parseFloat(a.change));
      } else if (mode === "losers") {
        sorted.sort((a, b) => parseFloat(a.change) - parseFloat(b.change));
      } else {
        sorted.sort((a, b) => Math.abs(parseFloat(b.change)) - Math.abs(parseFloat(a.change)));
      }
      render(sorted);
    } catch (error) {
      results.innerHTML = "";
      results.appendChild(createErrorMessage(error.message, () => loadRanked(mode)));
    }
  };

  const loadRecent = async () => {
    const recents = JSON.parse(localStorage.getItem("recentStocks") || "[]");
    if (recents.length === 0) {
      setMessage("No recently viewed stocks yet.");
      return;
    }
    setMessage("Loading...");
    try {
      const stocks = await fetchQuotes(recents);
      const bySymbol = {};
      stocks.forEach((stock) => {
        bySymbol[stock.symbol] = stock;
      });
      const ordered = recents.map((symbol) => bySymbol[symbol]).filter(Boolean);
      if (ordered.length === 0) {
        setMessage("No recently viewed stocks yet.");
        return;
      }
      render(ordered);
    } catch (error) {
      results.innerHTML = "";
      results.appendChild(createErrorMessage(error.message, loadRecent));
    }
  };

  const search = async (query) => {
    setMessage("Searching...");
    try {
      const list = await searchSymbols(query);
      const filtered = selectedCountry
        ? list.filter((item) => item.country === selectedCountry)
        : list;
      if (filtered.length === 0) {
        setMessage("No stocks found.");
        return;
      }
      render(sortList(dedupe(filtered)).slice(0, 20));
    } catch (error) {
      results.innerHTML = "";
      results.appendChild(createErrorMessage(error.message, () => search(query)));
    }
  };

  const refresh = () => {
    const query = input.value.trim();
    if (query !== "") {
      search(query);
      return;
    }
    if (selectedSort === "recent") {
      loadRecent();
      return;
    }
    if (rankedModes.includes(selectedSort)) {
      loadRanked(selectedSort);
      return;
    }
    loadDefaultList();
  };

  countries.forEach((country) => {
    const option = document.createElement("div");
    option.className = "country-option";
    if (country.value === selectedCountry) option.classList.add("country-option-active");
    option.textContent = country.label;
    option.addEventListener("click", () => {
      selectedCountry = country.value;
      toggle.textContent = country.label;
      menu.querySelectorAll(".country-option").forEach((el) => el.classList.remove("country-option-active"));
      option.classList.add("country-option-active");
      menu.classList.remove("open");
      refresh();
    });
    menu.appendChild(option);
  });

  sortOptions.forEach((option) => {
    const el = document.createElement("div");
    el.className = "country-option";
    if (option.value === selectedSort) el.classList.add("country-option-active");
    el.textContent = option.label;
    el.addEventListener("click", () => {
      selectedSort = option.value;
      sortToggle.textContent = option.label;
      sortMenu.querySelectorAll(".country-option").forEach((x) => x.classList.remove("country-option-active"));
      el.classList.add("country-option-active");
      sortMenu.classList.remove("open");
      refresh();
    });
    sortMenu.appendChild(el);
  });

  toggle.addEventListener("click", () => {
    menu.classList.toggle("open");
  });

  sortToggle.addEventListener("click", () => {
    sortMenu.classList.toggle("open");
  });

  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
      menu.classList.remove("open");
    }
    if (!sortDropdown.contains(event.target)) {
      sortMenu.classList.remove("open");
    }
  });

  input.addEventListener("input", () => {
    clearTimeout(timer);
    const query = input.value.trim();
    if (query === "") {
      refresh();
      return;
    }
    timer = setTimeout(() => search(query), 400);
  });

  refresh();
});