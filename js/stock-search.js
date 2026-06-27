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

document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("#stock-search-input");
  const results = document.querySelector(".stock-results");
  const dropdown = document.querySelector("#country-dropdown");
  const toggle = document.querySelector("#country-toggle");
  const menu = document.querySelector("#country-menu");
  let timer;
  let selectedCountry = "";

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

  const sortBySymbol = (list) =>
    list.slice().sort((a, b) => a.symbol.localeCompare(b.symbol));

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
      render(sortBySymbol(defaultStocks));
      return;
    }
    setMessage("Loading stocks...");
    try {
      const list = await fetchStocksByCountry(selectedCountry);
      const cleaned = dedupe(sortBySymbol(list)).slice(0, 30);
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
      render(dedupe(filtered).slice(0, 20));
    } catch (error) {
      results.innerHTML = "";
      results.appendChild(createErrorMessage(error.message, () => search(query)));
    }
  };

  const refresh = () => {
    const query = input.value.trim();
    if (query === "") {
      loadDefaultList();
    } else {
      search(query);
    }
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

  toggle.addEventListener("click", () => {
    menu.classList.toggle("open");
  });

  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
      menu.classList.remove("open");
    }
  });

  input.addEventListener("input", () => {
    clearTimeout(timer);
    const query = input.value.trim();
    if (query === "") {
      loadDefaultList();
      return;
    }
    timer = setTimeout(() => search(query), 400);
  });

  loadDefaultList();
});