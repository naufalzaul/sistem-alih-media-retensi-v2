import Chart from 'chart.js/auto';


export function renderTransaksiKunjunganBarChart(canvas, data) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const labels = ["Alih Media", "Retensi", "Pemusnahan"];
  const values = [
    data.statistik?.alih_media?.total || 0,
    data.statistik?.retensi?.total || 0,
    data.statistik?.pemusnahan?.total || 0,
  ];

  return new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Jumlah Arsip",
          data: values,
          backgroundColor: ["#3b82f6", "#10b981", "#ef4444"],
          borderRadius: 8,
          barThickness: 32,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1f2937",
          titleColor: "#f9fafb",
          bodyColor: "#f9fafb",
          cornerRadius: 6,
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} arsip`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "#374151", font: { size: 12 } },
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: "#6b7280",
            font: { size: 12 },
            callback: (val) => `${val}`,
          },
          grid: { color: "#e5e7eb", lineWidth: 1 },
        },
      },
    },
  });
}


export function renderRetensiBarChart(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['2023', '2024', '2025'],
      datasets: [
        {
          label: 'Selesai',
          data: [30, 50, 70],
          backgroundColor: '#10b981',
          borderRadius: 6,
          barThickness: 30,
        },
        {
          label: 'Dalam Proses',
          data: [40, 30, 20],
          backgroundColor: '#6ee7b7',
          borderRadius: 6,
          barThickness: 30,
        },
        {
          label: 'Belum Dimulai',
          data: [30, 20, 10],
          backgroundColor: '#d1d5db',
          borderRadius: 6,
          barThickness: 30,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#374151',
            font: { size: 12 },
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.dataset.label}: ${context.parsed.y} arsip`,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#374151',
            font: { size: 12 },
          },
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: '#6b7280',
            font: { size: 12 },
            precision: 0,
          },
          grid: {
            color: '#e5e7eb',
          },
        },
      },
    },
  });
}

export function renderPemusnahanBarChart(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['2023', '2024', '2025'],
      datasets: [
        {
          label: 'Selesai',
          data: [20, 40, 60],
          backgroundColor: '#10b981',
          borderRadius: 6,
          barThickness: 30,
        },
        {
          label: 'Dalam Proses',
          data: [35, 25, 20],
          backgroundColor: '#6ee7b7',
          borderRadius: 6,
          barThickness: 30,
        },
        {
          label: 'Belum Dimulai',
          data: [45, 35, 20],
          backgroundColor: '#d1d5db',
          borderRadius: 6,
          barThickness: 30,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#374151',
            font: { size: 12 },
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.dataset.label}: ${context.parsed.y} arsip`,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#374151',
            font: { size: 12 },
          },
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: '#6b7280',
            font: { size: 12 },
            precision: 0,
          },
          grid: {
            color: '#e5e7eb',
          },
        },
      },
    },
  });
}