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
      triggerSearch();
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
    if (input.value.trim() === "") {
      results.innerHTML = "";
      return;
    }
    timer = setTimeout(triggerSearch, 400);
  });
});