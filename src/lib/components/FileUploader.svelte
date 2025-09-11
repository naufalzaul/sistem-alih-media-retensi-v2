<script>
  import Icon from "@iconify/svelte";

  export let dokumenFiles = [];
  export let existingFiles = [];
  export let errors = {};

  let fileInput;
  // svelte-ignore export_let_unused
  export let form;

  const validTypes = [
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  function handleFileChange(event) {
    event.stopPropagation();
    const validFiles = Array.from(event.target.files).filter(
      (file) =>
        validTypes.includes(file.type) ||
        file.name.endsWith(".pdf") ||
        file.name.endsWith(".xls") ||
        file.name.endsWith(".xlsx")
    );

    const newFiles = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      type: file.type,
      isNew: true,
    }));

    dokumenFiles = [...dokumenFiles, ...newFiles];
    event.target.value = "";
  }

  function tambahDokumen() {
    fileInput.click();
  }

  function hapusFile(id) {
    if (existingFiles.some((f) => f.id === id)) {
      existingFiles = existingFiles.map((f) =>
        f.id === id ? { ...f, markedForDeletion: true } : f
      );
    } else {
      dokumenFiles = dokumenFiles.filter((f) => f.id !== id);
    }
  }

  function previewFile(file) {
    const url = file.url || URL.createObjectURL(file.file);
    window.open(url, "_blank");
  }

  function getFileIcon(type) {
    if (type.includes("pdf")) return "mdi:file-pdf-box";
    if (type.includes("excel") || type.includes("spreadsheet"))
      return "mdi:file-excel-box";
    return "mdi:file-document-outline";
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
  on:click={tambahDokumen}
>
  <Icon
    icon="mdi:cloud-upload-outline"
    class="text-4xl text-gray-400 mx-auto"
  />
  <p class="mt-2 text-sm text-gray-600">
    Drag & drop file atau <span class="text-blue-600 font-medium"
      >klik untuk memilih</span
    >
  </p>
  <input
    bind:this={fileInput}
    type="file"
    multiple
    accept=".pdf,.xls,.xlsx"
    class="hidden"
    on:change={handleFileChange}
  />
</div>

{#if existingFiles.length > 0 || dokumenFiles.length > 0}
  <ul class="space-y-2 mt-4">
    {#each existingFiles as file (file.id)}
      {#if !file.markedForDeletion}
        <li class="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <div class="flex items-center gap-3">
            <Icon
              icon={getFileIcon(file.type)}
              class="text-2xl text-gray-500"
            />
            <div>
              <p class="text-sm font-medium text-gray-800 truncate max-w-xs">
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
      <li class="flex items-center justify-between p-3 bg-gray-50 rounded-md">
        <div class="flex items-center gap-3">
          <Icon icon={getFileIcon(file.type)} class="text-2xl text-gray-500" />
          <div>
            <p class="text-sm font-medium text-gray-800 truncate max-w-xs">
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
  <p class="text-sm text-red-600 mt-2">{errors.File[0]}</p>
{/if}
