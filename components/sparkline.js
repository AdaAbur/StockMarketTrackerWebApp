function createSparkline(symbol, width, height) {
  const wrapper = document.createElement("span");
  wrapper.className = "sparkline";

  const canvas = document.createElement("canvas");
  canvas.width = width || 100;
  canvas.height = height || 32;
  wrapper.appendChild(canvas);

  const draw = (series) => {
    if (!series.prices.length) return;
    const up = series.prices[series.prices.length - 1] >= series.prices[0];
    new Chart(canvas, {
      type: "line",
      data: {
        labels: series.labels,
        datasets: [{
          data: series.prices,
          borderColor: up ? "#34C759" : "#FF3B30",
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false,
          tension: 0.3
        }]
      },
      options: {
        responsive: false,
        animation: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } }
      }
    });
  };

  const cacheKey = "spark_" + symbol;
  const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
  const now = Date.now();

  if (cached && cached.prices && cached.prices.length && now - cached.time < 600000) {
    draw(cached);
    return wrapper;
  }

  fetchTimeSeries(symbol, "5min", 78)
    .then((series) => {
      if (series.prices.length) {
        localStorage.setItem(cacheKey, JSON.stringify({ time: now, labels: series.labels, prices: series.prices }));
        draw(series);
      } else if (cached && cached.prices && cached.prices.length) {
        draw(cached);
      }
    })
    .catch(() => {
      if (cached && cached.prices && cached.prices.length) {
        draw(cached);
      }
    });

  return wrapper;
}