<script>
  import Icon from "@iconify/svelte";
  import Button from "$lib/components/Button.svelte";
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";

  export let data;
</script>

<section class="text-gray-800 mb-12">
  <div>
    <h2 class="text-2xl font-semibold">Laporan Statistik Pasien</h2>
    <p class="text-sm text-gray-500 mb-4">
      Menampilkan ringkasan jumlah pasien aktif, nonaktif, serta total pasien di
      klinik Anda. Data diperbarui secara berkala untuk membantu analisis
      pertumbuhan layanan.
    </p>
  </div>

  <slot />
</section>
