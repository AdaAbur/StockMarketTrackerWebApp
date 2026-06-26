const rangeConfig = {
  "1D": { interval: "5min", outputsize: 78 },
  "1M": { interval: "1day", outputsize: 22 },
  "3M": { interval: "1day", outputsize: 66 },
  "1Y": { interval: "1day", outputsize: 252 }
};

const chartBackground = {
  id: "chartBackground",
  beforeDraw: (c) => {
    const area = c.chartArea;
    if (!area) return;
    const ctx = c.ctx;
    ctx.save();
    ctx.fillStyle = "#0a1018";
    ctx.fillRect(area.left, area.top, area.right - area.left, area.bottom - area.top);
    ctx.restore();
  }
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
    const rgb = up ? "52, 199, 89" : "255, 59, 48";

    const height = wrapper.clientHeight || 280;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(" + rgb + ", 0.4)");
    gradient.addColorStop(1, "rgba(" + rgb + ", 0)");

    if (chart) chart.destroy();
    chart = new Chart(canvas, {
      type: "line",
      data: {
        labels: series.labels,
        datasets: [{
          data: series.prices,
          borderColor: color,
          backgroundColor: gradient,
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
      },
      plugins: [chartBackground]
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