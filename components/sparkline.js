function createSparkline(symbol) {
  const wrapper = document.createElement("span");
  wrapper.className = "sparkline";

  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 32;
  wrapper.appendChild(canvas);

  fetchTimeSeries(symbol, "1day", 30)
    .then((series) => {
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
    })
    .catch(() => {});

  return wrapper;
}