<script>
  import { enhance } from "$app/forms";
  import Input from "$components/Input.svelte";
  import Button from "$components/Button.svelte";
  import Icon from "@iconify/svelte";
  import { showToast } from "$lib/utils/ToastAlert.js";

  import { localData } from "$lib/stores/localData";

  export let form;
  export let isEditMode = false;

  export let defaultValues = {
    JenisKasus: "",
    MasaAktifRi: 0,
    MasaInaktifRi: 0,
    MasaAktifRj: 0,
    MasaInaktifRj: 0,
    InfoLain: "",
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

<form method="POST" use:enhance class="p-3">
  <div class="space-y-4 mb-6">
    <div>
      <a
        href="/kasus"
        class="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
      >
        <Icon icon="mdi:arrow-left" class="text-lg" />
        <span>Kembali ke Daftar Kasus</span>
      </a>
    </div>

    <div class="my-10">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">
        {isEditMode ? "Edit Data Kasus" : "Formulir Kasus Baru"}
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
      <h2 class="text-xl font-semibold text-gray-800">Jenis Kasus</h2>
      <p class="text-sm text-gray-500">Masukkan jenis kasus</p>
    </div>

    <div class="grid grid-cols-1 gap-4">
      <Input
        name="JenisKasus"
        type="text"
        bind:value={values.JenisKasus}
        label="Jenis Kasus"
        placeholder="Contoh: Rawat Inap, Rawat Jalan, dll"
        icon="mdi:clipboard-list"
        error={errors.JenisKasus?.[0]}
      />
    </div>
  </div>

  <div
    class="border-t border-gray-200 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8"
  >
    <div class="space-y-2">
      <span class="inline-block text-gray-600 rounded-full">02</span>
      <h2 class="text-xl font-semibold text-gray-800">Rawat Inap</h2>
      <p class="text-sm text-gray-500">
        Data masa aktif dan inaktif rawat inap
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        name="MasaAktifRi"
        type="number"
        bind:value={values.MasaAktifRi}
        label="Masa Aktif (tahun)"
        placeholder="0"
        icon="mdi:calendar-check"
        error={errors.MasaAktifRi?.[0]}
      />

      <Input
        name="MasaInaktifRi"
        type="number"
        bind:value={values.MasaInaktifRi}
        label="Masa Inaktif (tahun)"
        placeholder="0"
        icon="mdi:calendar-remove"
        error={errors.MasaInaktifRi?.[0]}
      />
    </div>
  </div>

  <div
    class="border-t border-gray-200 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8"
  >
    <div class="space-y-2">
      <span class="inline-block text-gray-600 rounded-full">03</span>
      <h2 class="text-xl font-semibold text-gray-800">Rawat Jalan</h2>
      <p class="text-sm text-gray-500">
        Data masa aktif dan inaktif rawat jalan
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        name="MasaAktifRj"
        type="number"
        bind:value={values.MasaAktifRj}
        label="Masa Aktif (tahun)"
        placeholder="0"
        icon="mdi:calendar-check"
        error={errors.MasaAktifRj?.[0]}
      />

      <Input
        name="MasaInaktifRj"
        type="number"
        bind:value={values.MasaInaktifRj}
        label="Masa Inaktif (tahun)"
        placeholder="0"
        icon="mdi:calendar-remove"
        error={errors.MasaInaktifRj?.[0]}
      />
    </div>
  </div>

  <div
    class="border-t border-gray-200 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8"
  >
    <div class="space-y-2">
      <span class="inline-block text-gray-600 rounded-full">04</span>
      <h2 class="text-xl font-semibold text-gray-800">Keterangan InfoLain</h2>
      <p class="text-sm text-gray-500">
        Tambahkan keterangan tambahan jika diperlukan
      </p>
    </div>

    <div class="grid grid-cols-1 gap-4">
      <div class="form-group">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Detail Lainnya
        </label>

        <!-- svelte-ignore element_invalid_self_closing_tag -->
        <textarea
          name="InfoLain"
          bind:value={values.InfoLain}
          class="focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="Masukkan keterangan tambahan..."
          rows="4"
        ></textarea>
        {#if errors.InfoLain?.[0]}
          <span class="text-red-500 text-xs">({errors.InfoLain[0]})</span>
        {/if}
      </div>
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
