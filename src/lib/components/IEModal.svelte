<script>
  import Modal from "$lib/components/Modal.svelte";
  import Icon from "@iconify/svelte";
  import { enhance } from "$app/forms";
  import { createEventDispatcher } from "svelte";
  import { showToast } from "$lib/utils/ToastAlert.js";

  export let form;
  export let action = "";
  export let title = "";

  export let open = false;
  export let onClose = () => {};

  let fileInput;
  let existingFiles = [];
  let dokumenFiles = [];
  export let errors = {};

  function tambahDokumen() {
    fileInput.click();
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type,
      file,
    }));
    dokumenFiles = [...dokumenFiles, ...files];
  }

  function hapusFile(id) {
    dokumenFiles = dokumenFiles.filter((f) => f.id !== id);
    existingFiles = existingFiles.map((f) =>
      f.id === id ? { ...f, markedForDeletion: true } : f
    );
  }

  function previewFile(file) {
    console.log("Preview:", file);
  }

  function getFileIcon(type) {
    if (type.includes("excel") || type.includes("spreadsheet"))
      return "mdi:file-excel";
    return "mdi:file-document-outline";
  }

  const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<Modal {open} {onClose} size="lg">
  <svelte:fragment slot="header">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Import Dokumen</h2>
    </div>
  </svelte:fragment>

  <svelte:fragment slot="body">
    <form
      method="POST"
      enctype="multipart/form-data"
      use:enhance={({ formData }) => {
        return async ({ update, result }) => {
          if (result?.toast) {
            open = false;
            showToast(result.toast.message, result.toast.type, result.redirect);
          }
          await update({ reset: true });
        };
      }}
      {action}
      class="space-y-4 divide-y divide-gray-200"
    >
      <section class="space-y-3">
        <h3
          class="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center"
        >
          <Icon
            icon="mdi:account-box-outline"
            class="mr-2 w-4 h-4 text-gray-500"
          />
          {title}
        </h3>
        <p class="text-sm text-gray-500">
          Unggah dokumen dalam format
          <span class="font-medium text-gray-700">Excel (.xls atau .xlsx)</span
          >.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div
            class="col-span-2 border-2 border-dashed border-gray-300 rounded-lg p-16 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            on:click={tambahDokumen}
          >
            <Icon
              icon="mdi:cloud-upload-outline"
              class="text-4xl text-gray-400 mx-auto"
            />
            <p class="mt-2 text-sm text-gray-600">
              Seret & letakkan file ke area ini, atau
              <span class="text-blue-600 font-medium"
                >klik untuk memilih dari perangkat</span
              >
            </p>

            <input
              bind:this={fileInput}
              id="dokumen-upload"
              name="File"
              type="file"
              multiple
              accept=".xls,.xlsx"
              class="hidden"
              on:change={handleFileChange}
            />
          </div>
          <div class="col-span-2 flex justify-end gap-2">
            <button
              type="button"
              class="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              on:click={onClose}
            >
              Batal
            </button>

            <button
              type="submit"
              class="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1"
            >
              <Icon icon="lucide:upload" />
              Import
            </button>
          </div>

          {#if existingFiles.length > 0 || dokumenFiles.length > 0}
            <ul class="col-span-2 space-y-2">
              {#each existingFiles as file (file.id)}
                {#if !file.markedForDeletion}
                  <li
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                  >
                    <div class="flex items-center gap-3">
                      <Icon
                        icon={getFileIcon(file.type)}
                        class="text-2xl text-gray-500"
                      />
                      <div>
                        <p
                          class="text-sm font-medium text-gray-800 truncate max-w-xs"
                        >
                          {file.name}
                        </p>
                        <p class="text-xs text-gray-500">{file.size}</p>
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <button
                        type="button"
                        on:click={() => previewFile(file)}
                        class="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <Icon icon="mdi:eye-outline" />
                      </button>
                      <button
                        type="button"
                        on:click={() => hapusFile(file.id)}
                        class="text-red-600 hover:text-red-800 p-1"
                      >
                        <Icon icon="mdi:trash-can-outline" />
                      </button>
                    </div>
                  </li>
                {/if}
              {/each}

              {#each dokumenFiles as file (file.id)}
                <li
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div class="flex items-center gap-3">
                    <Icon
                      icon={getFileIcon(file.type)}
                      class="text-2xl text-gray-500"
                    />
                    <div>
                      <p
                        class="text-sm font-medium text-gray-800 truncate max-w-xs"
                      >
                        {file.name}
                      </p>
                      <p class="text-xs text-gray-500">{file.size}</p>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button
                      type="button"
                      on:click={() => previewFile(file)}
                      class="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <Icon icon="mdi:eye-outline" />
                    </button>
                    <button
                      type="button"
                      on:click={() => hapusFile(file.id)}
                      class="text-red-600 hover:text-red-800 p-1"
                    >
                      <Icon icon="mdi:trash-can-outline" />
                    </button>
                  </div>
                </li>
              {/each}
            </ul>
          {:else if errors.File?.[0]}
            <p class="col-span-2 text-sm text-red-600">{errors.File[0]}</p>
          {/if}
        </div>
      </section>
    </form>
  </svelte:fragment>
</Modal>
