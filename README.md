# Tradeon - Stock Market Tracker (Web App)

Responsive stock market tracker web app. Part 2 of the Frontend Programming final project.
Live stock data, charts, news, watchlist, portfolio, and a buyable Pro plan.

## Live site

https://adaabur.github.io/StockMarketTrackerWebApp/

## How to run

Open `index.html` in a browser (it opens the welcome page), or serve the folder
with any static server. No build step is required.

## Technologies

- HTML5, CSS3, vanilla JavaScript
- Bootstrap 5 (Pro page, via CDN)
- Chart.js (price charts, via CDN)
- Twelve Data API (live quotes, search, price history)
- Finnhub API (market news)
- open.er-api.com (currency exchange rates)
- Browser Geolocation API + BigDataCloud (user country)

## Pages

- Welcome (landing)
- Login / Register
- Dashboard (market overview, watchlist preview, location, summary)
- Stock Search (live symbol search)
- Stock Details (live quote, price chart with 1D/1M/3M/1Y, company info)
- News (live headlines + clickable stock prices)
- Watchlist (saved stocks with live prices)
- Portfolio (holdings, profit/loss, buy/sell)
- Pro (pricing plans, Bootstrap 5)
- Settings (profile, password, currency, light/dark theme)

## Features

- Live data with red/green coloring for losses/gains
- Search stocks by symbol or company name
- Price history charts with selectable time ranges
- Watchlist and portfolio saved in the browser (localStorage)
- Currency switching (USD, EUR, GBP, TRY)
- Light and dark theme across all pages
- Geolocation to detect the user's country
- Reusable error messages with retry on API failures

## API keys

API keys live in `js/config.js`:

- `apiKey` - Twelve Data
- `newsKey` - Finnhub

Both use free plans. Replace them with your own keys if the limits are reached.

## Project structure

- `index.html` - welcome / landing page
- `pages/` - app pages
- `css/` - styles (theme, base, components, per-page)
- `components/` - reusable UI (navbar, stat card, stock row, error message)
- `js/` - logic (config, api, geo, per-page scripts)