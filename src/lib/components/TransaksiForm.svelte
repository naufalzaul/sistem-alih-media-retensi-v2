<script>
  import { enhance } from "$app/forms";
  import Input from "$components/Input.svelte";
  import Button from "$components/Button.svelte";
  import Icon from "@iconify/svelte";
  import { showToast } from "$lib/utils/ToastAlert.js";
  import { localData } from "$lib/stores/localData";
  import SearchableSelect from "$components/SearchableSelect.svelte";

  export let data;
  export let form;
  export let title = "";
  export let isEditMode = false;
  export let formOptions = {
    statusOption: [],
  };

  export let defaultValues = {
    IdKunjungan: "",
    TglLaporan: "",
    Status: "",
  };

  $: values = {
    ...defaultValues,
    ...(form?.values || {}),
  };

  $: errors = form?.errors || {};
  $: formError = form?.formError;
  $: if (form?.toast) {
    localData?.set(null);
    showToast(form.toast.message, form.toast.type, form.redirect);
  }
</script>

<form method="POST" use:enhance class="p-3 space-y-10">
  <div>
    <a
      href="/transaksi/alihmedia"
      class="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
    >
      <Icon icon="mdi:arrow-left" class="text-lg" />
      <span>Kembali ke halaman utama</span>
    </a>
  </div>

  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-2">
      {isEditMode ? `Edit Data ${title}` : `Formulir ${title}`}
    </h1>
    <p class="text-gray-500">lengkapi formulir dibawah ini</p>
  </div>

  {#if formError}
    <div class="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
      <Icon icon="mdi:alert-circle" class="inline mr-2" />
      {formError}
    </div>
  {/if}

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
    <div class="space-y-2">
      <span class="inline-block text-gray-600 rounded-full">01</span>
      <h2 class="text-xl font-semibold text-gray-800">Id Kunjungan</h2>
      <p class="text-sm text-gray-500">Masukkan ID kunjungan terkait</p>
    </div>

    <div>
      <Input
        name="IdKunjungan"
        type="number"
        bind:value={values.IdKunjungan}
        label="ID Kunjungan"
        placeholder="Contoh: 14"
        icon="mdi:identifier"
        error={errors.IdKunjungan?.[0]}
      />
    </div>
  </div>

  <div
    class="border-t border-gray-200 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
  >
    <div class="space-y-2">
      <span class="inline-block text-gray-600 rounded-full">02</span>
      <h2 class="text-xl font-semibold text-gray-800">Data {title}</h2>
      <p class="text-sm text-gray-500">Tanggal laporan dan status</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        name="TglLaporan"
        type="date"
        bind:value={values.TglLaporan}
        label="Tanggal Laporan"
        icon="mdi:calendar"
        required
        error={errors.TglLaporan?.[0]}
      />

      <SearchableSelect
        name="Status"
        bind:selected={values.Status}
        options={formOptions.statusOption}
        placeholder="Pilih Status"
        label="Status"
        required
        error={errors.Status?.[0]}
      />
    </div>
  </div>

  <div class="border-t border-gray-200 pt-6 flex justify-between">
    <div class="text-sm text-gray-500">
      <Icon icon="mdi:information-outline" class="inline mr-1" />
      Pastikan semua data sudah benar
    </div>

    <div class="flex gap-3">
      <Button
        type="button"
        size="sm"
        variant="outline"
        on:click={() => history.back()}
      >
        Batal
      </Button>

      <Button type="submit" size="sm" variant="emerald">
        <Icon
          icon={isEditMode ? "mdi:pencil" : "mdi:content-save"}
          class="mr-2 -ml-1"
        />
        {isEditMode ? "Update Data" : "Simpan Data"}
      </Button>
    </div>
  </div>
</form>
