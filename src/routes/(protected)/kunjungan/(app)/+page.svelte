<script>
  import Icon from "@iconify/svelte";
  import Table from "$components/Table.svelte";
  import Pagination from "$components/Pagination.svelte";
  import Button from "$components/Button.svelte";
  import Input from "$components/Input.svelte";
  import DetailModal from "$lib/components/DetailModal.svelte";
  import DeleteModal from "$lib/components/DeleteModal.svelte";
  import { formatDate } from "$lib/utils/date";
  import { getStatusClass } from "$lib/utils/statusClass";
  import { goto } from "$app/navigation";

  export let data;
  export let form;

  let filterOpen = false;
  let values = {
    NoRM: "",
    NIK: "",
    NamaPasien: "",
  };

  let currentPage = data?.kunjungan?.page || 1;
  let perPage = 10;

  let showDetailModal = false;
  let showDeleteModal = false;
  let selectedDetailModal = null;
  let selectedDeleteModal = null;

  $: kunjunganData = data?.kunjungan?.data ?? data?.kunjungan ?? [];

  $: filteredPatients = Array.isArray(kunjunganData)
    ? kunjunganData.filter((patient) => {
        const matchesRM = values.NoRM
          ? patient.NoRM?.toLowerCase().includes(values.NoRM.toLowerCase())
          : true;
        const matchesNIK = values.NIK
          ? patient.NIK?.toLowerCase().includes(values.NIK.toLowerCase())
          : true;
        const matchesNamaPasien = values.NamaPasien
          ? patient.NamaPasien?.toLowerCase().includes(
              values.NamaPasien.toLowerCase()
            )
          : true;
        return matchesRM && matchesNIK && matchesNamaPasien;
      })
    : [];

  $: totalData = data?.kunjungan?.total || 0;

  function handlePageChange(page) {
    const params = new URLSearchParams({
      page,
      per_page: perPage,
    });
    goto(`/kunjungan?${params.toString()}`);
  }

  function handleAction({ type, detail }) {
    if (type === "view") {
      selectedDetailModal = detail;
      showDetailModal = true;
    } else if (type === "delete") {
      selectedDeleteModal = detail;
      showDeleteModal = true;
    }
  }

  async function previewFileWithToken(filePath) {
    if (!filePath) return;
    const url = `/api/preview?file=${encodeURIComponent(filePath)}`;
    window.open(url, "_blank");
  }
</script>

<div class="mt-12 relative">
  <div class="flex items-center gap-2 mb-3">
    <a href="/kunjungan/formulir/new">
      <Button variant="emerald" rounded="lg" size="sm">
        <Icon icon="lucide:plus" class="w-4 h-4 mr-2" />
        Tambah Data
      </Button>
    </a>

    <div class="flex items-center gap-2 ml-auto">
      <div class="relative filter-dropdown inline-block">
        <Button
          variant="outline"
          rounded="lg"
          size="sm"
          on:click={() => (filterOpen = !filterOpen)}
        >
          <Icon icon="lucide:search" class="w-4 h-4 mr-2" />
          Filter Kunjungan
          <Icon icon="lucide:chevron-down" class="w-4 h-4 ml-2" />
        </Button>

        {#if filterOpen}
          <form
            method="GET"
            action="/kunjungan"
            class="absolute right-0 mt-2 w-72 rounded-md shadow bg-white ring-1 ring-gray-200 z-50 p-4 space-y-3"
          >
            <Input
              name="NoRM"
              type="text"
              bind:value={values.NoRM}
              label="Nomor RM"
              placeholder="RM-20230001"
            />

            <Input
              name="NIK"
              type="text"
              bind:value={values.NIK}
              label="NIK"
              placeholder="NIK-000123"
            />

            <Input
              name="NamaPasien"
              type="text"
              bind:value={values.NamaPasien}
              label="Nama Pasien"
              placeholder="John Doe"
            />

            <div class="flex justify-end">
              <Button
                type="submit"
                size="sm"
                class="bg-blue-600 text-white hover:bg-blue-700"
              >
                Submit
              </Button>
            </div>
          </form>
        {/if}
      </div>
      <a
        href="/api/export/kunjungan"
        class="inline-flex items-center px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
      >
        <Icon icon="lucide:download" class="w-4 h-4 mr-2" />
        Export
      </a>
    </div>
  </div>

  <Table
    columns={data.columns}
    data={filteredPatients}
    showAction={true}
    actions={[
      {
        name: "view",
        label: "Detail",
        color: "text-gray-600 hover:bg-gray-50",
      },
      {
        name: "edit",
        label: "Edit",
        color: "text-gray-600 hover:bg-gray-50",
        href: (row) => `/kunjungan/formulir/${row.ID}`,
      },
      {
        name: "delete",
        label: "Hapus",
        color: "text-red-600 hover:bg-red-50",
      },
    ]}
    on:view={handleAction}
    on:edit={handleAction}
    on:delete={handleAction}
  >
    <svelte:fragment slot="pagination">
      <Pagination
        total={totalData}
        {perPage}
        defaultPage={currentPage}
        onPageChange={handlePageChange}
      />
    </svelte:fragment>
  </Table>

  {#if selectedDetailModal}
    <DetailModal
      bind:open={showDetailModal}
      title="Detail Kunjungan"
      onClose={() => (showDetailModal = false)}
      data={selectedDetailModal}
    >
      <section slot="custom-section" class="space-y-3 pb-4">
        <h3
          class="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center"
        >
          <Icon
            icon="heroicons:clipboard-document-list-20-solid"
            class="mr-2 w-4 h-4"
          />
          Rekam Medis
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="space-y-2">
            <p class="text-gray-500">Jenis Kasus</p>
            <p class="font-medium text-gray-800">
              {selectedDetailModal?.JenisKasus || "-"}
            </p>
          </div>

          <div class="space-y-2">
            <p class="text-gray-500">Jenis Kunjungan</p>
            <p class="font-medium text-gray-800">
              {selectedDetailModal?.JenisKunjungan || "-"}
            </p>
          </div>

          <div class="space-y-2">
            <p class="text-gray-500">Tgl Masuk</p>
            <p class="font-medium text-gray-800">
              {selectedDetailModal?.TglMasuk
                ? formatDate(selectedDetailModal.TglMasuk)
                : "-"}
            </p>
          </div>

          <div class="space-y-2">
            <p class="text-gray-500">Status</p>
            <p
              class={`w-fit px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                selectedDetailModal?.Status
              )}`}
            >
              {selectedDetailModal?.Status || "-"}
            </p>
          </div>

          <div class="col-span-2 space-y-2">
            <p class="text-gray-500">Info Lain</p>
            <p class="font-medium text-gray-800">
              {selectedDetailModal?.InfoLain || "-"}
            </p>
          </div>

          <div class="col-span-2 space-y-2">
            <p class="text-gray-500">Dokumen</p>
            {#if selectedDetailModal?.Dokumen}
              <ul class="space-y-1">
                {#each Array.isArray(selectedDetailModal.Dokumen) ? selectedDetailModal.Dokumen : [selectedDetailModal.Dokumen] as file}
                  <li>
                    <button
                      type="button"
                      class="text-blue-600 hover:underline"
                      on:click={() => previewFileWithToken(file)}
                    >
                      {file.split("/").pop()}
                    </button>
                  </li>
                {/each}
              </ul>
            {:else}
              <p class="font-medium text-gray-800">-</p>
            {/if}
          </div>
        </div>
      </section>
    </DetailModal>
  {/if}

  {#if selectedDeleteModal}
    <DeleteModal
      bind:open={showDeleteModal}
      title="Delete Kunjungan"
      onClose={() => (showDeleteModal = false)}
      data={selectedDeleteModal}
      action={"?/delete"}
      {form}
    >
      <div slot="custom-section">
        <h1>Yakin ingin menghapus data? {selectedDeleteModal.NamaPasien}</h1>
      </div>
    </DeleteModal>
  {/if}
</div>

<!-- <script>
  import Icon from "@iconify/svelte";
  import Table from "$components/Table.svelte";
  import Pagination from "$components/Pagination.svelte";
  import Button from "$components/Button.svelte";
  import Input from "$components/Input.svelte";
  import DetailModal from "$lib/components/DetailModal.svelte";
  import DeleteModal from "$lib/components/DeleteModal.svelte";
  import { formatDate, formatDateTime } from "$lib/utils/date";
  import { PUBLIC_API_BASE_URL } from "$env/static/public";
  import { getStatusClass } from "$lib/utils/statusClass";
  import { goto } from "$app/navigation";

  export let data;
  export let form;

  let filterOpen = false;
  let values = {
    NoRM: "",
    NIK: "",
    NamaPasien: "",
  };

  let currentPage = data?.kunjungan?.page || 1;
  let perPage = 10;

  let showDetailModal = false;
  let showDeleteModal = false;
  let showImportModal = false;
  let selectedDetailModal = null;
  let selectedDeleteModal = null;
  let selectedImportModal = null;

  $: filteredPatients = (data?.kunjungan?.data ?? data?.kunjungan ?? []).filter(
    (patient) => {
      const matchesRM = values.NoRM
        ? patient.NoRM?.toLowerCase().includes(values.NoRM.toLowerCase())
        : true;
      const matchesNIK = values.NIK
        ? patient.NIK?.toLowerCase().includes(values.NIK.toLowerCase())
        : true;
      const matchesNamaPasien = values.NamaPasien
        ? patient.NamaPasien?.toLowerCase().includes(
            values.NamaPasien.toLowerCase()
          )
        : true;
      return matchesRM && matchesNIK && matchesNamaPasien;
    }
  );

  $: totalData = data?.kunjungan?.total || 0;

  function handlePageChange(page) {
    const params = new URLSearchParams({
      page,
      per_page: perPage,
    });
    goto(`/kunjungan?${params.toString()}`);
  }

  function handleAction({ type, detail }) {
    if (type === "view") {
      selectedDetailModal = detail;
      showDetailModal = true;
    } else if (type === "delete") {
      selectedDeleteModal = detail;
      showDeleteModal = true;
    }
  }
  async function previewFileWithToken(filePath) {
    if (!filePath) return;
    const url = `/api/preview?file=${encodeURIComponent(filePath)}`;
    window.open(url, "_blank");
  }
</script>

<div class="mt-12 relative">
  <div class="flex items-center gap-2 mb-3">
    <a href="/kunjungan/formulir/new">
      <Button variant="emerald" rounded="lg" size="sm">
        <Icon icon="lucide:plus" class="w-4 h-4 mr-2" />
        Tambah Data
      </Button>
    </a>

    <div class="flex items-center gap-2 ml-auto">
      <div class="relative filter-dropdown inline-block">
        <Button
          variant="outline"
          rounded="lg"
          size="sm"
          on:click={() => (filterOpen = !filterOpen)}
        >
          <Icon icon="lucide:search" class="w-4 h-4 mr-2" />
          Filter Kunjungan
          <Icon icon="lucide:chevron-down" class="w-4 h-4 ml-2" />
        </Button>

        {#if filterOpen}
          <form
            method="GET"
            action="/kunjungan"
            class="absolute right-0 mt-2 w-72 rounded-md shadow bg-white ring-1 ring-gray-200 z-50 p-4 space-y-3"
          >
            <Input
              name="NoRM"
              type="text"
              bind:value={values.NoRM}
              label="Nomor RM"
              placeholder="RM-20230001"
            />

            <Input
              name="NIK"
              type="text"
              bind:value={values.NIK}
              label="NIK"
              placeholder="NIK-000123"
            />

            <Input
              name="NamaPasien"
              type="text"
              bind:value={values.NamaPasien}
              label="Nama Pasien"
              placeholder="John Doe"
            />

            <div class="flex justify-end">
              <Button
                type="submit"
                size="sm"
                class="bg-blue-600 text-white hover:bg-blue-700"
                on:click={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </form>
        {/if}
      </div>
      <a
        href="/api/export/kunjungan"
        class="inline-flex items-center px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
      >
        <Icon icon="lucide:download" class="w-4 h-4 mr-2" />
        Export
      </a>
    </div>
  </div>

  <Table
    columns={data.columns}
    data={data?.kunjungan?.data || data?.kunjungan}
    showAction={true}
    actions={[
      {
        name: "view",
        label: "Detail",
        color: "text-gray-600 hover:bg-gray-50",
      },
      {
        name: "edit",
        label: "Edit",
        color: "text-gray-600 hover:bg-gray-50",
        href: (row) => `/kunjungan/formulir/${row.ID}`,
      },
      {
        name: "delete",
        label: "Hapus",
        color: "text-red-600 hover:bg-red-50",
      },
    ]}
    on:view={handleAction}
    on:edit={handleAction}
    on:delete={handleAction}
  >
    <svelte:fragment slot="pagination">
      <Pagination
        total={totalData}
        {perPage}
        defaultPage={currentPage}
        onPageChange={handlePageChange}
      />
    </svelte:fragment>
  </Table>

  {#if selectedDetailModal}
    <DetailModal
      bind:open={showDetailModal}
      title="Detail Pasien"
      onClose={() => (showDetailModal = false)}
      data={selectedDetailModal}
    >
      <section slot="custom-section" let:statusColors class="space-y-3 pb-4">
        <h3
          class="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center"
        >
          <Icon
            icon="heroicons:clipboard-document-list-20-solid"
            class="mr-2 w-4 h-4"
          />
          Rekam Medis
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="space-y-2">
            <p class="text-gray-500">Jenis Kasus</p>
            <p class="font-medium text-gray-800">
              {selectedDetailModal?.JenisKasus || "-"}
            </p>
          </div>

          <div class="space-y-2">
            <p class="text-gray-500">Jenis Kunjungan</p>
            <p class="font-medium text-gray-800">
              {selectedDetailModal?.JenisKunjungan || "-"}
            </p>
          </div>

          <div class="space-y-2">
            <p class="text-gray-500">Tgl Masuk</p>
            <p class="font-medium text-gray-800">
              {selectedDetailModal?.TglMasuk
                ? formatDate(selectedDetailModal.TglMasuk)
                : "-"}
            </p>
          </div>

          <div class="space-y-2">
            <p class="text-gray-500">Status</p>
            <p
              class={`w-fit px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(selectedDetailModal?.Status)}`}
            >
              {selectedDetailModal?.Status || "-"}
            </p>
          </div>

          <div class="col-span-2 space-y-2">
            <p class="text-gray-500">Info Lain</p>
            <p class="font-medium text-gray-800">
              {selectedDetailModal?.InfoLain || "-"}
            </p>
          </div>

          <div class="col-span-2 space-y-2">
            <p class="text-gray-500">Dokumen</p>
            {#if selectedDetailModal?.Dokumen}
              <ul class="space-y-1">
                {#each Array.isArray(selectedDetailModal.Dokumen) ? selectedDetailModal.Dokumen : [selectedDetailModal.Dokumen] as file}
                  <li>
                    <button
                      type="button"
                      class="text-blue-600 hover:underline"
                      on:click={() => previewFileWithToken(file)}
                    >
                      {file.split("/").pop()}
                    </button>
                  </li>
                {/each}
              </ul>
            {:else}
              <p class="font-medium text-gray-800">-</p>
            {/if}
          </div>
        </div>
      </section>
    </DetailModal>
  {/if}

  {#if selectedDeleteModal}
    <DeleteModal
      bind:open={showDeleteModal}
      title="Delete Kasus"
      onClose={() => (showDeleteModal = false)}
      data={selectedDeleteModal}
      action={"?/delete"}
      {form}
    >
      <div slot="custom-section">
        <h1>Yakin ingin menghapus data? {selectedDeleteModal.NamaPasien}</h1>
      </div>
    </DeleteModal>
  {/if}
</div> -->
