<script>
  import { enhance } from "$app/forms";
  import Input from "$components/Input.svelte";
  import Button from "$components/Button.svelte";
  import SearchableSelect from "$components/SearchableSelect.svelte";
  import Icon from "@iconify/svelte";
  import { showToast } from "$lib/utils/ToastAlert.js";

  import { localData } from "$lib/stores/localData";

  export let formOptions = {
    genderOptions: [],
  };

  export let defaultValues;

  export let form;
  export let isEditMode = false;

  $: values = {
    ...defaultValues,
    ...form?.values,
  };

  $: errors = form?.errors || {};
  $: formError = form?.formError;
  $: if (!values.Status) values.Status = "Aktif";

  $: if (form?.toast) {
    localData?.set(null);
    showToast(form.toast.message, form.toast.type, form.redirect);
  }
</script>

<form method="POST" use:enhance class="p-3">
  <div class="space-y-4 mb-6">
    <div>
      <a
        href="/pasien"
        class="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
      >
        <Icon icon="mdi:arrow-left" class="text-lg" />
        <span>Kembali ke Daftar Pasien</span>
      </a>
    </div>

    <div class="my-10">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">
        {isEditMode ? "Edit Data Pasien" : "Formulir Pasien Baru"}
      </h1>
      <p class="text-gray-500">Lengkapi semua informasi berikut dengan benar</p>
    </div>
  </div>

  {#if formError}
    <div class="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
      <Icon icon="mdi:alert-circle" class="inline mr-2" />
      {formError}
    </div>
  {/if}

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8">
    <div class="space-y-2">
      <span class="inline-block text-gray-600 rounded-full">01</span>
      <h2 class="text-xl font-semibold text-gray-800">Data Pasien</h2>
      <p class="text-sm text-gray-500">
        Identitas lengkap pasien untuk keperluan administrasi
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        name="NoRM"
        type="text"
        bind:value={values.NoRM}
        label="Nomor RM"
        placeholder="RM-20230001"
        required
        error={errors.NoRM?.[0]}
      />

      <Input
        name="NIK"
        bind:value={values.NIK}
        label="NIK"
        placeholder="3274xxxxxxxxxxxx"
        required
        pattern="[0-9]{16}"
        title="Harus 16 digit angka"
        icon="mdi:card-account-details"
        error={errors.NIK?.[0]}
      />

      <div class="md:col-span-2">
        <Input
          name="NamaPasien"
          bind:value={values.NamaPasien}
          label="Nama Lengkap"
          placeholder="Siti Aminah"
          required
          error={errors.NamaPasien?.[0]}
        />
      </div>
      <div class="md:col-span-2">
        <Input
          name="Alamat"
          bind:value={values.Alamat}
          label="Alamat Lengkap"
          placeholder="Jl. Kenanga No. 12, Kec. Ngawi, Kab. Ngawi"
          required
          icon="mdi:home-map-marker"
          error={errors.Alamat?.[0]}
        />
      </div>

      <SearchableSelect
        name="JenisKelamin"
        bind:selected={values.JenisKelamin}
        options={formOptions.genderOptions}
        placeholder="Pilih Jenis Kelamin"
        label="Jenis Kelamin"
        required
        error={errors.JenisKelamin?.[0]}
      />

      <Input
        name="TglLahir"
        type="date"
        bind:value={values.TglLahir}
        label="Tanggal Lahir"
        required
        icon="mdi:cake-variant"
        error={errors.TglLahir?.[0]}
      />
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8">
    <div class="space-y-2">
      <span class="inline-block text-gray-600 rounded-full">02</span>
      <h2 class="text-xl font-semibold text-gray-800">Status Pasien</h2>
      <p class="text-sm text-gray-500">
        Kondisi aktif/inaktif pasien untuk pengelolaan retensi
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      Pastikan semua data yang dimasukkan sudah benar
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
