<script>
  import { enhance } from "$app/forms";
  import Input from "$components/Input.svelte";
  import Button from "$components/Button.svelte";

  export let values = {};
  export let errors = {};
</script>

<form method="POST" use:enhance action="?/searchKasus" class="p-3">
  <div
    class="border-t border-gray-200 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8"
  >
    <div class="space-y-2">
      <span class="inline-block text-gray-600 rounded-full">03</span>
      <h2 class="text-xl font-semibold text-gray-800">Jenis Kasus</h2>
      <p class="text-sm text-gray-500">Cari jenis kasus untuk kunjungan ini</p>
    </div>
    <div class="space-y-4 w-full">
      <div class="flex gap-2">
        <Input
          bind:value={values.JenisKasus}
          name="JenisKasus"
          placeholder="Masukkan kode/nama kasus"
          icon="mdi:shape-outline"
          error={errors.JenisKasus?.[0]}
        />
        <Button type="submit">Cari</Button>
      </div>
      <Input
        value={values.JenisKasus}
        name="JenisKasus"
        label="Jenis Kasus"
        disabled
      />
    </div>
  </div>
</form>
