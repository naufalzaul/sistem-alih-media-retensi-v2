import Chart from "chart.js/auto";

export function renderJenisKasusRadarChart(canvas, data) {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const labels = Object.keys(data.statistik?.kasus.list || {});
  const values = Object.values(data.statistik?.kasus.list || {});

  return new Chart(ctx, {
    type: "radar",
    data: {
      labels,
      datasets: [
        {
          label: "Jumlah Kasus",
          data: values,
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          borderColor: "#3b82f6",
          pointBackgroundColor: "#3b82f6",
          borderWidth: 1.5,
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#3b82f6"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          angleLines: { color: "#e5e7eb" },
          grid: { color: "#e5e7eb" },
          pointLabels: {
            color: "#374151",
            font: {
              size: 12
            }
          },
          ticks: {
            color: "#6b7280",
            stepSize: 20,
            display: false
          }
        }
      },
      plugins: {
        legend: {
          position: "top",
          labels: { color: "#374151" },
          display: false
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} kasus`
          }
        }
      }
    }
  });
}
