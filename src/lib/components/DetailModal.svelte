<script>
  import Modal from "$lib/components/Modal.svelte";
  import { formatDate, formatDateTime } from "$lib/utils/date";
  import Icon from "@iconify/svelte";
  import { getStatusClass } from "$lib/utils/statusClass";

  export let open = false;
  export let onClose = () => {};
  export let data = null;
</script>

<Modal {open} {onClose} size="lg">
  <svelte:fragment slot="header">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Informasi Lengkap Pasien</h2>
    </div>
  </svelte:fragment>

  <svelte:fragment slot="body">
    <div class="space-y-4 divide-y divide-gray-200">
      <section class="space-y-3 pb-4">
        <h3
          class="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center"
        >
          <Icon icon="heroicons:user-circle-20-solid" class="mr-2 w-4 h-4" />
          Informasi Pasien
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="space-y-2">
            <p class="text-gray-500">Nama Pasien</p>
            <p class="font-medium text-gray-800">{data?.NamaPasien || "-"}</p>
          </div>
          <div class="space-y-2">
            <p class="text-gray-500">Nomor RM</p>
            <p class="font-medium text-gray-800">{data?.NoRM || "-"}</p>
          </div>
          <div class="space-y-2">
            <p class="text-gray-500">Jenis Kelamin</p>
            <p class="font-medium text-gray-800">{data?.JenisKelamin || "-"}</p>
          </div>
          <div class="space-y-2">
            <p class="text-gray-500">Tanggal Lahir</p>
            <p class="font-medium text-gray-800">
              {#if data?.TglLahir}
                {formatDate(data.TglLahir)}
              {:else if data?.TanggalLahir}
                {formatDate(data.TanggalLahir)}
              {:else}
                -
              {/if}
            </p>
          </div>
          <div class="space-y-2">
            <p class="text-gray-500">NIK</p>
            <p class="font-medium text-gray-800">{data?.NIK || "-"}</p>
          </div>
          <div class="space-y-2">
            <p class="text-gray-500">Status</p>
            <p
              class={`w-fit px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(data?.StatusPasien || data?.Status)}`}
            >
              {data?.StatusPasien || data?.Status || "-"}
            </p>
          </div>
          {#if data?.Alamat}
            <div class="space-y-2 md:col-span-2">
              <p class="text-gray-500">Alamat</p>
              <p class="font-medium text-gray-800">{data.Alamat}</p>
            </div>
          {/if}
        </div>
      </section>
      <slot name="rekam-medis"></slot>
      <slot name="custom-section"></slot>
    </div>
  </svelte:fragment>
</Modal>
