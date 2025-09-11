<script>
  import { enhance } from "$app/forms";
  import Button from "$components/Button.svelte";
  import Input from "$components/Input.svelte";
  import { showToast } from "$lib/utils/ToastAlert.js";

  export let data;

  let form;
  let logoFile = null;
  let uploadError = "";

  let previewUrl = "/logo.jpg";

  function handleLogoUpload(event) {
    uploadError = "";
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/svg+xml",
    ];
    if (!validTypes.includes(file.type)) {
      uploadError = "Format harus JPG, PNG, atau SVG";
      event.target.value = "";
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      uploadError = "Ukuran maksimal 1MB";
      event.target.value = "";
      return;
    }

    logoFile = file;

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    previewUrl = URL.createObjectURL(file);
  }

  function removeLogo() {
    if (logoFile && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    logoFile = null;
    uploadError = "";
    previewUrl = data?.system?.Logo
      ? `data:image/png;base64,${data.system.Logo}`
      : "/logo.jpg";

    const input = document.querySelector('input[name="Logo"]');
    if (input) input.value = "";
  }
</script>

<section class="text-gray-800 space-y-10">
  <div class="border-b border-gray-300 pb-4">
    <h2 class="text-2xl font-bold tracking-tight">Informasi Sistem</h2>
    <p class="text-sm text-gray-500 mt-1">
      Kelola nama aplikasi, logo, dan preferensi sistem lainnya.
    </p>
  </div>

  <form
    method="POST"
    enctype="multipart/form-data"
    action="/pengaturan/api/system"
    use:enhance={({ formData }) => {
      return async ({ update, result }) => {
        if (result?.toast)
          showToast(result.toast.message, result.toast.type, result.redirect);
        await update({ reset: false });
      };
    }}
    class="space-y-12"
  >
    <input type="hidden" name="id" value={data.system?.ID} />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
      <div class="space-y-3">
        <h3 class="text-lg font-semibold">Logo Aplikasi</h3>
        <p class="text-sm text-gray-500">Logo yang digunakan saat ini:</p>
        <div class="mt-2 p-1 border border-gray-300 rounded w-fit">
          <img
            src={`data:image/png;base64,${data.system?.Logo}`}
            alt="Logo Aplikasi"
            class="h-32 w-32 rounded object-cover"
          />
        </div>
      </div>

      <div class="space-y-4">
        <label
          class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition"
        >
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              class="w-8 h-8 mb-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16V4m0 0L3 8m4-4l4 4M5 20h14a2 2 0 002-2V10a2 2 0 00-2-2h-4l-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <p class="text-sm text-gray-500">Klik untuk upload logo</p>
            <p class="text-xs text-gray-400">Format: JPG / PNG / SVG (≤2MB)</p>
          </div>
          <input
            name="Logo"
            type="file"
            accept="image/jpeg, image/png, image/svg+xml"
            class="hidden"
            on:change={handleLogoUpload}
          />
        </label>

        {#if uploadError}
          <p class="text-sm text-red-500 mt-1">{uploadError}</p>
        {/if}

        {#if logoFile}
          <div
            class="flex items-center justify-between p-3 bg-gray-50 rounded shadow-sm"
          >
            <div class="flex items-center gap-3">
              <img src={previewUrl} alt="Preview" class="h-8 w-8 rounded" />
              <span class="text-sm text-gray-700">{logoFile.name}</span>
            </div>
            <button
              type="button"
              on:click={removeLogo}
              class="text-red-500 hover:text-red-700 text-sm"
            >
              Hapus
            </button>
          </div>
        {/if}
      </div>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-2 gap-10 items-start border-t border-gray-200 pt-8"
    >
      <div class="space-y-1">
        <h3 class="text-lg font-semibold">Nama Aplikasi</h3>
        <p class="text-sm text-gray-500">
          Nama aplikasi yang ditampilkan di sistem.
        </p>
      </div>
      <Input
        name="NamaAplikasi"
        label="Nama Aplikasi"
        value={data.system?.NamaAplikasi}
        placeholder="Masukkan nama aplikasi"
        required
      />
    </div>

    <div class="flex justify-end">
      <Button type="submit" variant="emerald" rounded="lg" size="sm">
        Simpan Perubahan
      </Button>
    </div>
  </form>
</section>
