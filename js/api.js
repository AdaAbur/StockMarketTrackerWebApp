const CURRENCIES = { USD: "$", EUR: "€", GBP: "£", TRY: "₺" };

let currencyRates = { USD: 1 };

(function () {
  try {
    const cached = JSON.parse(localStorage.getItem("currencyRates") || "null");
    if (cached && cached.USD) {
      currencyRates = cached;
    }
  } catch (error) {
    currencyRates = { USD: 1 };
  }
})();

function getCurrency() {
  return localStorage.getItem("currency") || "USD";
}

function setCurrency(code) {
  localStorage.setItem("currency", code);
}

function currencySymbol() {
  return CURRENCIES[getCurrency()] || "$";
}

function convertFromUsd(amount) {
  const rate = currencyRates[getCurrency()] || 1;
  return amount * rate;
}

async function loadCurrencyRates() {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await response.json();
    if (data && data.rates) {
      currencyRates = data.rates;
      localStorage.setItem("currencyRates", JSON.stringify(data.rates));
    }
  } catch (error) {}
}

function formatMoney(value) {
  const number = parseFloat(value);
  if (isNaN(number)) return "-";
  return currencySymbol() + convertFromUsd(number).toFixed(2);
}

function formatNumber(value) {
  const number = parseInt(value, 10);
  return isNaN(number) ? "-" : number.toLocaleString();
}

async function apiRequest(endpoint, params) {
  const url = new URL(API_CONFIG.baseUrl + endpoint);
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
  url.searchParams.append("apikey", API_CONFIG.apiKey);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network error. Please try again.");
  }

  const data = await response.json();
  if (data.status === "error") {
    throw new Error(data.message || "Could not load data.");
  }
  return data;
}

function normalizeQuote(item) {
  const change = parseFloat(item.percent_change);
  return {
    symbol: item.symbol,
    name: item.name,
    price: formatMoney(item.close),
    change: (change >= 0 ? "+" : "") + change.toFixed(2) + "%",
    trend: change >= 0 ? "up" : "down"
  };
}

async function fetchQuote(symbol) {
  const data = await apiRequest("/quote", { symbol: symbol });
  const fiftyTwo = data.fifty_two_week || {};
  return {
    ...normalizeQuote(data),
    details: {
      Exchange: data.exchange || "-",
      Currency: data.currency || "-",
      Open: formatMoney(data.open),
      "Day High": formatMoney(data.high),
      "Day Low": formatMoney(data.low),
      "Previous Close": formatMoney(data.previous_close),
      Volume: formatNumber(data.volume),
      "52-Week High": formatMoney(fiftyTwo.high),
      "52-Week Low": formatMoney(fiftyTwo.low)
    }
  };
}

async function fetchQuotes(symbols) {
  if (symbols.length === 0) return [];
  const data = await apiRequest("/quote", { symbol: symbols.join(",") });
  const items = symbols.length === 1 ? { [symbols[0]]: data } : data;
  return symbols
    .map((symbol) => items[symbol])
    .filter((item) => item && item.symbol)
    .map((item) => normalizeQuote(item));
}

async function searchSymbols(query) {
  const data = await apiRequest("/symbol_search", { symbol: query });
  return (data.data || []).map((item) => ({
    symbol: item.symbol,
    name: item.instrument_name
  }));
}

async function fetchTimeSeries(symbol, interval, outputsize) {
  const data = await apiRequest("/time_series", {
    symbol: symbol,
    interval: interval,
    outputsize: outputsize
  });
  const values = (data.values || []).slice().reverse();
  return {
    labels: values.map((item) => item.datetime),
    prices: values.map((item) => parseFloat(item.close))
  };
}

async function fetchNews() {
  const url = API_CONFIG.newsUrl + "/news?category=general&token=" + API_CONFIG.newsKey;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network error. Please try again.");
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Could not load news.");
  }

  return data.slice(0, 20).map((item) => {
    const summary = item.summary || "";
    return {
      headline: item.headline,
      summary: summary.length > 180 ? summary.slice(0, 180) + "…" : summary,
      source: item.source,
      url: item.url,
      image: item.image
    };
  });
}