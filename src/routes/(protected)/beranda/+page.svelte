<script>
  import Sidebar from "$components/Sidebar.svelte";
  import Button from "$components/Button.svelte";
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";
  import {
    renderTransaksiKunjunganBarChart,
    renderRetensiBarChart,
    renderPemusnahanBarChart,
  } from "$lib/utils/BarChart";
  import { renderLaporanLineChart } from "$lib/utils/LineChart";
  import { renderJenisKasusRadarChart } from "$lib/utils/RadarChart";

  export let data;

  let canvasTransaksiBar, canvasLaporanLine;
  let canvasRetensiBar, canvasPemusnahanBar;

  let chartTransaksiBar, chartLaporanLine;
  let chartRetensiBar, chartPemusnahanBar;

  let chartKasusBar, canvasKasusLine;

  const format = (num) => new Intl.NumberFormat("id-ID").format(num);
  const formatPercent = (n) => `${Number(n || 0).toFixed(0)}%`;
  const currentYear = new Date().getFullYear();

  onMount(() => {
    chartTransaksiBar && chartTransaksiBar.destroy();
    chartLaporanLine && chartLaporanLine.destroy();
    chartRetensiBar && chartRetensiBar.destroy();
    chartPemusnahanBar && chartPemusnahanBar.destroy();
    chartKasusBar && chartKasusBar.destroy();

    chartTransaksiBar = renderTransaksiKunjunganBarChart(
      canvasTransaksiBar,
      data
    );
    chartRetensiBar = renderRetensiBarChart(canvasRetensiBar);
    chartPemusnahanBar = renderPemusnahanBarChart(canvasPemusnahanBar);
    chartLaporanLine = renderLaporanLineChart(canvasLaporanLine);

    chartKasusBar = renderJenisKasusRadarChart(canvasKasusLine, data);
  });
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

<section class="text-gray-800 mb-8">
  <div class="space-y-1">
    <h2 class="text-3xl font-semibold tracking-tight">
      Selamat datang, {data.user.name || "Pengguna"} 👋
    </h2>
    <p class="text-gray-500">
      Kelola data pasien, tinjau laporan, dan awasi kategori kasus dari satu
      tempat.
    </p>
  </div>

  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 items-stretch"
  >
    <div
      class="relative bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-2xl shadow-lg p-6 overflow-hidden transition hover:shadow-xl min-h-56"
    >
      <div class="absolute inset-0 flex items-center justify-center opacity-10">
        <Icon icon="mdi:account-circle" class="text-[200px]" />
      </div>

      <div class="absolute top-4 left-4 z-10">
        <span
          class="bg-white/10 px-4 py-1 rounded-full text-sm font-medium capitalize tracking-wide border border-white/20"
        >
          {data.user.role}
        </span>
      </div>

      <a
        href="/pengaturan"
        class="absolute top-4 right-4 z-10 text-white hover:text-emerald-200"
        title="Profil Saya"
      >
        <Icon icon="mdi:open-in-new" class="text-xl" />
      </a>

      <div class="relative z-10 flex flex-col justify-end h-full">
        <h3 class="text-xl font-semibold leading-tight uppercase">
          {data.user.name || "Pengguna"}
        </h3>
        <p class="text-sm text-emerald-100 mt-1">
          {data.user.username || data.user.email}
        </p>
      </div>
    </div>

    <div
      class="relative w-full flex flex-col justify-between max-w-sm p-5 rounded-2xl shadow-sm bg-gray-50 border border-gray-100"
    >
      <div class="flex items-center gap-2 mb-3">
        <div class="bg-blue-100 text-blue-600 p-2 rounded-md">
          <Icon icon="mdi:file-document-outline" class="text-lg" />
        </div>
        <h3 class="text-sm font-medium text-gray-700">Total Dokumen</h3>
      </div>

      <div class="flex items-center gap-2 mb-4">
        <p class="text-4xl font-bold text-gray-800 truncate max-w-[10rem]">
          {format(data.statistik?.dokumen.total)}
        </p>
        <span
          class="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full"
        >
          +{formatPercent(data.statistik?.dokumen.persen)}
        </span>
      </div>

      <div class="flex items-start gap-2">
        <div class="flex items-end gap-1 h-12">
          <div class="w-1.5 h-1.5 bg-blue-300 rounded-full"></div>
          <div class="w-1.5 h-3 bg-blue-400 rounded-full"></div>
          <div class="w-1.5 h-2 bg-blue-500 rounded-full"></div>
          <div class="w-1.5 h-5 bg-blue-600 rounded-full"></div>
          <div class="w-1.5 h-3 bg-blue-500 rounded-full"></div>
          <div class="w-1.5 h-4 bg-blue-400 rounded-full"></div>
          <div class="w-1.5 h-2 bg-blue-300 rounded-full"></div>
        </div>

        <p class="text-sm text-gray-500 leading-snug">
          Seluruh dokumen yang tercatat hingga tahun
          <span class="font-semibold text-gray-700">{currentYear}</span>
        </p>
      </div>
    </div>

    <div
      class="relative w-full flex flex-col justify-between max-w-sm p-5 rounded-2xl shadow-sm bg-gray-50 border border-gray-100"
    >
      <div class="flex items-center gap-2 mb-3">
        <div class="bg-emerald-100 text-emerald-600 p-2 rounded-md">
          <Icon icon="mdi:account-group-outline" class="text-lg" />
        </div>
        <h3 class="text-sm font-medium text-gray-700">Total Pasien</h3>
      </div>

      <div class="flex items-center gap-2 mb-4">
        <p class="text-4xl font-bold text-gray-800 truncate max-w-[10rem]">
          {data.statistik?.pasien.total}
        </p>
        <span
          class="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full"
        >
          +{formatPercent(data.statistik?.pasien.persen)}
        </span>
      </div>

      <div class="flex items-end gap-3">
        <div class="flex items-end gap-1 h-12">
          <div class="w-1.5 h-3 bg-emerald-400 rounded"></div>
          <div class="w-1.5 h-4 bg-emerald-400 rounded"></div>
          <div class="w-1.5 h-6 bg-emerald-500 rounded"></div>
          <div class="w-1.5 h-8 bg-emerald-500 rounded"></div>
          <div class="w-1.5 h-6 bg-emerald-500 rounded"></div>
          <div class="w-1.5 h-4 bg-emerald-400 rounded"></div>
          <div class="w-1.5 h-5 bg-emerald-300 rounded"></div>
        </div>

        <p class="text-sm text-gray-500 leading-snug">
          Keseluruhan pasien yang terdata hingga tahun
          <span class="font-semibold text-gray-700">{currentYear}</span>
        </p>
      </div>
    </div>

    <div
      class="relative w-full flex flex-col justify-between max-w-sm p-5 rounded-2xl shadow-sm bg-gray-50 border border-gray-100"
    >
      <div class="flex items-center gap-2 mb-3">
        <div class="bg-rose-100 text-rose-600 p-2 rounded-md">
          <Icon icon="mdi:alert-decagram-outline" class="text-lg" />
        </div>
        <h3 class="text-sm font-medium text-gray-700">Total Kasus</h3>
      </div>

      <div class="flex items-center gap-2 mb-4">
        <p class="text-4xl font-bold text-gray-800 truncate">
          {format(data.statistik?.kasus.total)}
        </p>
      </div>

      <div class="flex items-end gap-3">
        <div class="flex items-center gap-0.5 h-12">
          <div class="w-1.5 h-3 bg-rose-400 rounded"></div>
          <div class="w-1.5 h-6 bg-rose-500 rounded"></div>
          <div class="w-1.5 h-9 bg-rose-600 rounded"></div>
          <div class="w-1.5 h-6 bg-rose-500 rounded"></div>
          <div class="w-1.5 h-3 bg-rose-400 rounded"></div>
        </div>

        <p class="text-sm text-gray-500 leading-snug">
          Jumlah kasus yang tercatat sepanjang tahun
          <span class="font-semibold text-gray-700">{currentYear}</span>
        </p>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-8 gap-6 my-8">
    <div
      class="lg:col-span-5 bg-white border border-gray-100 shadow-sm hover:shadow-md rounded-2xl p-6 transition duration-300 relative"
    >
      <div class="flex items-center gap-2 mb-5">
        <h3 class="font-semibold text-lg text-gray-800">
          Jenis Kasus Terbanyak
        </h3>
        <Icon
          icon="mdi:information-outline"
          class="text-xl text-gray-400 hover:text-emerald-600 transition duration-200 cursor-pointer"
          title="Statistik jumlah kasus penyakit terbanyak berdasarkan rekam medis"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
        <div
          class="md:col-span-2 flex flex-col justify-between space-y-4 h-full"
        >
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <Icon icon="mdi:virus" class="text-2xl text-emerald-500" />
              <p
                class="text-3xl font-bold text-gray-800 truncate max-w-[10rem]"
              >
                {format(data.statistik?.kasus_terbanyak.total)}
              </p>
            </div>
            <p class="text-sm text-gray-500">Total kasus penyakit bulan ini</p>

            <div
              class="flex items-center gap-1 text-sm text-emerald-600 font-medium"
            >
              <Icon icon="mdi:trending-up" class="text-base" />
              <span
                >+{formatPercent(data.statistik?.kasus.persen)} dibanding bulan lalu</span
              >
            </div>
          </div>

          <div class="flex flex-col gap-2 text-sm text-gray-600 mt-2">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-blue-500"></span>
              <span>Jumlah Kasus</span>
            </div>
          </div>
        </div>

        <div class="md:col-span-3 h-64 relative">
          <canvas
            bind:this={canvasKasusLine}
            class="absolute inset-0 w-full h-full"
          ></canvas>
        </div>
      </div>
    </div>

    <div class="lg:col-span-3">
      <div
        class="bg-white shadow-md hover:shadow-lg rounded-2xl p-6 transition border border-gray-100 space-y-5"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <h3 class="text-gray-800 font-semibold text-lg">
              Transaksi Kunjungan
            </h3>
            <Icon
              icon="mdi:information-outline"
              class="text-xl text-gray-400 hover:text-emerald-600 transition"
              title="Statistik kunjungan alih media, retensi, dan pemusnahan"
            />
          </div>

          <span
            class="px-3 py-0.5 rounded-md text-sm border font-medium border-gray-300 text-gray-600"
          >
            {currentYear}
          </span>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <Icon icon="mdi:folder-file" class="text-2xl text-blue-500" />
            <p class="text-3xl font-bold text-gray-800 truncate max-w-[7rem]">
              {format(data.statistik?.kunjungan.total)}
            </p>
          </div>
          <p class="text-sm text-gray-500">
            Total kunjungan arsip dari seluruh jenis layanan.
          </p>
        </div>

        <div class="w-full h-48 relative rounded-xl overflow-hidden">
          <canvas
            bind:this={canvasTransaksiBar}
            class="absolute inset-0 w-full h-full"
          ></canvas>
        </div>
      </div>
    </div>
  </div>
</section>
