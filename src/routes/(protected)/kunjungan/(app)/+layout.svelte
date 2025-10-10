<script>
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";

  export let data;

  let chartEl;
  let chart;

  let totalKunjungan = {
    title: "Total Kunjungan",
    value: data.general?.kunjungan?.total || 0,
    change: +0,
  };
  let kunjunganHariIni = {
    title: "Kunjungan Hari Ini",
    value: data.general?.kunjungan?.today || 0,
    change: +0,
  };
  let kunjunganBulanIni = {
    title: "Kunjungan Bulan Ini",
    value: data.general?.kunjungan?.year || 0,
    change: -0,
  };

  let labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  let dataset = [120, 140, 180, 160, 200, 190, 220];

  onMount(() => {
    chart = new Chart(chartEl, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Kunjungan",
            data: dataset,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59,130,246,0.1)",
            tension: 0.4,
            fill: true,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: false } },
      },
    });
    return () => chart.destroy();
  });
</script>

<section class="text-gray-800 mb-12">
  <div>
    <h2 class="text-2xl font-semibold">Statistik Kunjungan</h2>
    <p class="text-sm text-gray-500 mb-4">
      Ringkasan data kunjungan pasien per hari, bulan, dan total keseluruhan.
    </p>
  </div>

  <div
    class="p-5 border-y border-gray-300 grid grid-cols-1 md:grid-cols-12 divide-x divide-gray-300 gap-6"
  >
    <div
      class="col-span-12 md:col-span-5 flex items-center justify-between px-4"
    >
      <div class="flex flex-col gap-1">
        <span>{totalKunjungan.title}</span>
        <div class="text-3xl font-semibold">{totalKunjungan.value}</div>
        <div
          class="text-sm {totalKunjungan.change >= 0
            ? 'text-green-600'
            : 'text-red-600'}"
        >
          {totalKunjungan.change >= 0 ? "+" : ""}{totalKunjungan.change}% dari
          bulan lalu
        </div>
      </div>

      <div class="h-18 w-40">
        <canvas bind:this={chartEl}></canvas>
      </div>
    </div>

    <div
      class="col-span-12 md:col-span-4 flex flex-col gap-1 px-4 justify-center"
    >
      <span>{kunjunganHariIni.title}</span>
      <div class="text-2xl font-semibold">{kunjunganHariIni.value}</div>
      <div
        class="text-sm {kunjunganHariIni.change >= 0
          ? 'text-green-600'
          : 'text-red-600'}"
      >
        {kunjunganHariIni.change >= 0 ? "+" : ""}{kunjunganHariIni.change}%
        dibanding kemarin
      </div>
    </div>

    <div
      class="col-span-12 md:col-span-3 flex flex-col gap-1 px-4 justify-center"
    >
      <span>{kunjunganBulanIni.title}</span>
      <div class="text-2xl font-semibold">{kunjunganBulanIni.value}</div>
      <div
        class="text-sm {kunjunganBulanIni.change >= 0
          ? 'text-green-600'
          : 'text-red-600'}"
      >
        {kunjunganBulanIni.change >= 0 ? "+" : ""}{kunjunganBulanIni.change}%
        dibanding bulan lalu
      </div>
    </div>
  </div>

  <slot />
</section>
