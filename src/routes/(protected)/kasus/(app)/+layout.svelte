<script>
  export let data;

  const round = (n) => Math.round(n || 0);

  const items = [
    {
      key: "rata_masa_aktif_ri",
      title: "Rata-rata Masa Aktif RI",
      change: 0,
    },
    {
      key: "rata_masa_inaktif_ri",
      title: "Rata-rata Masa Inaktif RI",
      change: 0,
    },
    {
      key: "rata_masa_aktif_rj",
      title: "Rata-rata Masa Aktif RJ",
      change: 0,
    },
    {
      key: "rata_masa_inaktif_rj",
      title: "Rata-rata Masa Inaktif RJ",
      change: 0,
    },
  ];
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
    <h2 class="text-2xl font-semibold">Statistik Masa Aktif/Inaktif</h2>
    <p class="text-sm text-gray-500 mb-4">
      Ringkasan rata-rata masa aktif dan inaktif untuk rawat inap (RI) dan rawat
      jalan (RJ).
    </p>
  </div>

  <div
    class="p-5 border-y border-gray-300 grid grid-cols-1 md:grid-cols-12 divide-x divide-gray-300 gap-6"
  >
    {#each items as item}
      <div
        class="col-span-12 md:col-span-3 flex flex-col gap-1 px-4 justify-center"
      >
        <span class="text-gray-600">{item.title}</span>
        <div class="text-2xl font-semibold">
          {round(data.statistik?.[item.key] || 0)} tahun
        </div>
        <div
          class="text-sm {item.change >= 0 ? 'text-green-600' : 'text-red-600'}"
        >
          {item.change >= 0 ? "+" : ""}{item.change}% dari bulan lalu
        </div>
      </div>
    {/each}
  </div>

  <slot />
</section>
