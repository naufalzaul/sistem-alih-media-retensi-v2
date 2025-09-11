<script>
  import Icon from "@iconify/svelte";
  import Button from "$lib/components/Button.svelte";
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";

  let chartEl;
  let chart;

  export let data;

  onMount(() => {
    chart = new Chart(chartEl, {
      type: "line",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            data: [120, 140, 100, 160, 130, 180, 150, 170, 145, 200, 190, 210],
            borderColor: "#10b981",
            backgroundColor: "rgba(16,185,129,0.1)",
            tension: 0.4,
            fill: true,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 0,
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

  let total = {
    title: "Total Pasien",
    value: data.statistik.total || 0,
    change: +3,
  };

  let active = {
    title: "Pasien Aktif",
    value: data.statistik.total_aktif || 0,
    change: +8,
  };

  let inactive = {
    title: "Pasien Inaktif",
    value: data.statistik.total_tidak_aktif || 0,
    change: -5,
  };
</script>

{#if !data}
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    {#each items as item}
      <div class="col-span-12 md:col-span-3 flex flex-col gap-2 p-4">
        <div class="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-8 w-20 bg-gray-300 rounded animate-pulse"></div>
        <div class="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>
    {/each}
  </div>
{/if}
<section class="text-gray-800 mb-12">
  <div>
    <h2 class="text-2xl font-semibold">Statistik Pasien</h2>
    <p class="text-sm text-gray-500 mb-4">
      Ringkasan data pasien aktif, inaktif, dan total keseluruhan.
    </p>
  </div>

  <div
    class="p-5 border-y border-gray-300 grid grid-cols-1 md:grid-cols-12 divide-x divide-gray-300 gap-6"
  >
    <div
      class="col-span-12 md:col-span-5 flex items-center justify-between px-4"
    >
      <div class="flex flex-col gap-1">
        <span class="">Total Pasien Keseluruhan</span>
        <div class="text-3xl font-semibold">{total.value}</div>
        <div
          class="text-sm {total.change >= 0
            ? 'text-green-600'
            : 'text-red-600'}"
        >
          {total.change >= 0 ? "+" : ""}{total.change}% dari bulan lalu
        </div>
      </div>

      <div class="h-18 w-40">
        <canvas bind:this={chartEl}></canvas>
      </div>
    </div>

    <div
      class="col-span-12 md:col-span-4 flex flex-col gap-1 px-4 justify-center"
    >
      <span class="">Total Pasien Aktif</span>
      <div class="text-2xl font-semibold">{active.value}</div>
      <div
        class="text-sm {active.change >= 0 ? 'text-green-600' : 'text-red-600'}"
      >
        {active.change >= 0 ? "+" : ""}{active.change}% dari bulan lalu
      </div>
    </div>

    <div
      class="col-span-12 md:col-span-3 flex flex-col gap-1 px-4 justify-center"
    >
      <span class="">Total Pasien Tidak Aktif</span>
      <div class="text-2xl font-semibold">{inactive.value}</div>
      <div
        class="text-sm {inactive.change >= 0
          ? 'text-green-600'
          : 'text-red-600'}"
      >
        {inactive.change >= 0 ? "+" : ""}{inactive.change}% dari bulan lalu
      </div>
    </div>
  </div>

  <slot />
</section>
