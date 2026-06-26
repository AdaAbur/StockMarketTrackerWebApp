const rangeConfig = {
  "1D": { interval: "5min", outputsize: 78 },
  "1M": { interval: "1day", outputsize: 22 },
  "3M": { interval: "1day", outputsize: 66 },
  "1Y": { interval: "1day", outputsize: 252 }
};

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector("#price-chart");
  const wrapper = document.querySelector(".chart-wrapper");
  const buttons = document.querySelectorAll(".range-btn");
  if (!canvas) return;

  const params = new URLSearchParams(window.location.search);
  const symbol = params.get("symbol") || "AAPL";

  let chart;

  const setMessage = (text) => {
    wrapper.querySelectorAll(".chart-message").forEach((el) => el.remove());
    const message = document.createElement("p");
    message.className = "chart-message";
    message.textContent = text;
    wrapper.appendChild(message);
  };

  const clearMessage = () => {
    wrapper.querySelectorAll(".chart-message").forEach((el) => el.remove());
  };

  const drawChart = (series) => {
    const up = series.prices[series.prices.length - 1] >= series.prices[0];
    const color = up ? "#34C759" : "#FF3B30";
    const fill = up ? "rgba(52, 199, 89, 0.15)" : "rgba(255, 59, 48, 0.15)";

    if (chart) chart.destroy();
    chart = new Chart(canvas, {
      type: "line",
      data: {
        labels: series.labels,
        datasets: [{
          data: series.prices,
          borderColor: color,
          backgroundColor: fill,
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { display: false },
          y: {
            ticks: { color: "rgba(255, 255, 255, 0.54)" },
            grid: { color: "rgba(255, 255, 255, 0.08)" }
          }
        }
      }
    });
  };

  const loadRange = async (range) => {
    setMessage("Loading chart...");
    try {
      const config = rangeConfig[range];
      const series = await fetchTimeSeries(symbol, config.interval, config.outputsize);
      if (series.prices.length === 0) {
        setMessage("No chart data available.");
        return;
      }
      clearMessage();
      drawChart(series);
    } catch (error) {
      setMessage(error.message);
    }
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("range-btn-active"));
      button.classList.add("range-btn-active");
      loadRange(button.dataset.range);
    });
  });

  loadRange("1D");
});