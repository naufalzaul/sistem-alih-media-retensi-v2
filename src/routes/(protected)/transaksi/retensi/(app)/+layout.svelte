<script>
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";

  export let data;

  let chartTotal, chartAktif, chartNonAktif;

  const totalRetensi = {
    title: "Total Retensi",
    value: data?.statistik?.total_dokumen || 0,
    change: 0,
  };
  const retensiAktif = {
    title: "Retensi Aktif",
    value: data?.statistik?.total_sudah || 0,
    change: 0,
  };
  const retensiNonAktif = {
    title: "Retensi Non-Aktif",
    value: data?.statistik?.total_belum || 0,
    change: 0,
  };

  let labels = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul"];
  let datasetTotal = [200, 250, 300, 320, 350, 400, 450];
  let datasetAktif = [150, 180, 220, 250, 270, 300, 330];
  let datasetNonAktif = [50, 60, 80, 70, 80, 100, 120];

  const makeChart = (canvas, label, data, color) => {
    return new Chart(canvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label,
            data,
            borderColor: color,
            backgroundColor: color + "20",
            tension: 0.4,
            fill: true,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: false } },
      },
    });
  };

  onMount(() => {
    const c1 = makeChart(chartTotal, "Total", datasetTotal, "#3b82f6");
    const c2 = makeChart(chartAktif, "Aktif", datasetAktif, "#10b981");
    const c3 = makeChart(
      chartNonAktif,
      "Non-Aktif",
      datasetNonAktif,
      "#ef4444"
    );

    return () => {
      c1.destroy();
      c2.destroy();
      c3.destroy();
    };
  });
</script>

<section class="text-gray-800 mb-12">
  <div>
    <h2 class="text-2xl font-semibold">Statistik Retensi</h2>
    <p class="text-sm text-gray-500 mb-4">
      Ringkasan total retensi, aktif, dan non-aktif.
    </p>
  </div>

  <div class="my-7 grid grid-cols-1 md:grid-cols-3 gap-4">
    {#each [totalRetensi, retensiAktif, retensiNonAktif] as item, i}
      <div
        class="border border-gray-300 p-5 rounded-xl shadow flex items-end justify-between bg-white"
      >
        <div class="flex flex-col gap-2">
          <span class="text-gray-600">{item.title}</span>
          <div class="text-4xl font-semibold">{item.value}</div>
          <div
            class="text-sm {item.change >= 0
              ? 'text-green-600'
              : 'text-red-600'}"
          >
            {item.change >= 0 ? "+" : ""}{item.change}% dibanding bulan lalu
          </div>
        </div>
        <div class="h-16 w-28">
          {#if i === 0}
            <canvas bind:this={chartTotal}></canvas>
          {:else if i === 1}
            <canvas bind:this={chartAktif}></canvas>
          {:else}
            <canvas bind:this={chartNonAktif}></canvas>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <slot />
</section>
