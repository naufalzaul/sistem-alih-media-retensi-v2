<script>
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { get } from "svelte/store";

  import Input from "$components/Input.svelte";
  import Button from "$components/Button.svelte";
  import SearchableSelect from "$components/SearchableSelect.svelte";
  import Icon from "@iconify/svelte";
  import FileUploader from "$components/FileUploader.svelte";

  import { formatDate } from "$lib/utils/date";
  import { showToast } from "$lib/utils/ToastAlert.js";

  export let formOptions;
  export let data;
  export let form;
  export let isEditMode = false;

  export let defaultValues = {
    NoRM: "",
    NamaPasien: "",
    NIK: "",
    Alamat: "",
    JenisKasus: "",
    JenisKunjungan: "",
    TglMasuk: "",
    Dokumen: [],
    File: [],
  };

  let dokumenFiles = [];
  let existingFiles = [];
  let idFromUrlParams = "";
  let fileInput;

  function getFilesToSubmit() {
    return [
      ...existingFiles.filter((f) => !f.markedForDeletion),
      ...dokumenFiles,
    ];
  }

  function prepareFormData(formData) {
    formData.delete("File");

    dokumenFiles.forEach((fileObj) => {
      formData.append("File", fileObj.file);
    });

    existingFiles
      .filter((f) => !f.markedForDeletion)
      .forEach((fileObj) => {
        formData.append("ExistingFiles", fileObj.path);
      });

    existingFiles
      .filter((f) => f.markedForDeletion)
      .forEach((fileObj) => {
        formData.append("DeletedFiles", fileObj.path);
      });

    return formData;
  }

  onMount(() => {
    if (
      isEditMode &&
      Array.isArray(defaultValues?.File) &&
      defaultValues.File.length
    ) {
      existingFiles = defaultValues.File.map((filePath) => {
        const fileName = filePath.split(/[/\\]/).pop();
        return {
          id: crypto.randomUUID(),
          name: fileName,
          path: filePath,
          url: `/api/preview?file=${encodeURIComponent(filePath)}`,
          size: "—",
          type: fileName.toLowerCase().endsWith(".pdf")
            ? "application/pdf"
            : fileName.toLowerCase().endsWith(".xls") ||
                fileName.toLowerCase().endsWith(".xlsx")
              ? "application/vnd.ms-excel"
              : "application/octet-stream",
          isNew: false,
        };
      });
    }
  });

  $: values = { ...defaultValues, ...form?.values };
  $: errors = form?.errors || {};
  $: formError = form?.formError;

  $: if (form?.toast)
    showToast(form.toast.message, form.toast.type, form.redirect);
</script>

<div class="p-3">
  <div class="space-y-4 mb-6">
    <div>
      <a
        href="/kunjungan"
        class="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
      >
        <Icon icon="mdi:arrow-left" class="text-lg" />
        Kembali ke Daftar Kunjungan
      </a>
    </div>

    <div class="my-10">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">
        {isEditMode ? "Edit Data Kunjungan" : "Formulir Kunjungan Baru"}
      </h1>
      <p class="text-gray-500">
        Lengkapi informasi kunjungan berikut dengan benar
      </p>
    </div>
  </div>

  {#if formError}
    <div class="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
      <Icon icon="mdi:alert-circle" class="inline mr-2" />
      {formError}
    </div>
  {/if}

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

  <form method="POST" use:enhance action="?/searchKasus" class="p-3">
    <div
      class="border-t border-gray-200 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8"
    >
      <div class="space-y-2">
        <span class="inline-block text-gray-600 rounded-full">03</span>
        <h2 class="text-xl font-semibold text-gray-800">Jenis Kasus</h2>
        <p class="text-sm text-gray-500">
          Cari jenis kasus untuk kunjungan ini
        </p>
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

  <form
    method="POST"
    use:enhance={({ formData }) => prepareFormData(formData)}
    enctype="multipart/form-data"
    action={isEditMode ? "?/updateKunjungan" : "?/addKunjungan"}
    class="p-3"
  >
    <div
      class="border-t border-gray-200 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8"
    >
      <div class="space-y-2">
        <span class="inline-block text-gray-600 rounded-full">04</span>
        <h2 class="text-xl font-semibold text-gray-800">Tanggal Masuk</h2>
        <p class="text-sm text-gray-500">Isi tanggal masuk pasien</p>
      </div>
      <div class="grid grid-cols-1 gap-4">
        <Input
          type="date"
          bind:value={values.TglMasuk}
          name="TglMasuk"
          label="Tanggal Masuk"
          icon="mdi:calendar"
          required
          error={errors.TglMasuk?.[0]}
        />
      </div>
    </div>

    <div
      class="border-t border-gray-200 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8"
    >
      <div class="space-y-2">
        <span class="inline-block text-gray-600 rounded-full">05</span>
        <h2 class="text-xl font-semibold text-gray-800">Jenis Kunjungan</h2>
        <p class="text-sm text-gray-500">
          Pilih jenis kunjungan pasien (Rawat Jalan, Rawat Inap, IGD, dll)
        </p>
      </div>
      <div class="grid grid-cols-1 gap-4">
        <SearchableSelect
          bind:selected={values.JenisKunjungan}
          name="JenisKunjungan"
          label="Jenis Kunjungan"
          options={formOptions.JenisKunjungan}
          placeholder="Pilih jenis kunjungan"
        />
      </div>
    </div>

    <div
      class="border-t border-gray-200 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8"
    >
      <div class="space-y-2">
        <span class="inline-block text-gray-600 rounded-full">05</span>
        <h2 class="text-xl font-semibold text-gray-800">Dokumen</h2>
        <p class="text-sm text-gray-500">Unggah dokumen kunjungan (opsional)</p>
      </div>
      <div class="space-y-4">
        <FileUploader bind:dokumenFiles bind:existingFiles {errors} />
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
          on:click={() => history.back()}>Batal</Button
        >
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
</div>
