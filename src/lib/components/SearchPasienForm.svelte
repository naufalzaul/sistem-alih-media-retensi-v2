<script>
  import { enhance } from "$app/forms";
  import Input from "$components/Input.svelte";
  import Button from "$components/Button.svelte";

  export let values = {};
  export let errors = {};
</script>

<form method="POST" use:enhance action="?/searchPasien" class="p-3">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8">
    <div class="space-y-2">
      <span class="inline-block text-gray-600 rounded-full">01</span>
      <h2 class="text-xl font-semibold text-gray-800">Identifikasi Pasien</h2>
      <p class="text-sm text-gray-500">Masukkan Nomor RM pasien dan cari</p>
    </div>
    <div class="space-y-4 w-full">
      <div class="flex gap-2">
        <Input
          bind:value={values.NoRM}
          name="NoRM"
          placeholder="Contoh: RM123456"
          required
          icon="mdi:identifier"
          error={errors.NoRM?.[0]}
        />
        <Button type="submit">Cari</Button>
      </div>
      <Input value={values.NoRM} name="NoRM" label="Nomor RM" disabled />
    </div>
  </div>

  <div
    class="border-t border-gray-200 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8"
  >
    <div class="space-y-2">
      <span class="inline-block text-gray-600 rounded-full">02</span>
      <h2 class="text-xl font-semibold text-gray-800">Data Pasien</h2>
      <p class="text-sm text-gray-500">Informasi pasien otomatis terisi</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        bind:value={values.NamaPasien}
        name="NamaPasien"
        label="Nama Pasien"
        disabled
        icon="mdi:account"
      />
      <Input
        bind:value={values.NIK}
        name="NIK"
        label="NIK"
        disabled
        icon="mdi:card-account-details"
      />
      <Input
        bind:value={values.Alamat}
        name="Alamat"
        label="Alamat"
        disabled
        icon="mdi:home-map-marker"
        class="md:col-span-2"
      />
    </div>
  </div>
</form>
