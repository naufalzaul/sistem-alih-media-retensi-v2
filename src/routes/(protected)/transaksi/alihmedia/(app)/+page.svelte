<script>
  import Icon from "@iconify/svelte";
  import Table from "$components/Table.svelte";
  import Pagination from "$components/Pagination.svelte";
  import Button from "$components/Button.svelte";
  import Input from "$components/Input.svelte";
  import DetailModal from "$lib/components/DetailModal.svelte";
  import DeleteModal from "$lib/components/DeleteModal.svelte";
  import { formatDate } from "$lib/utils/date";
  import { goto } from "$app/navigation";
  import { getStatusClass } from "$lib/utils/statusClass";

  export let data;
  export let form;

  let filterOpen = false;
  let values = {
    NoRM: "",
    NamaPasien: "",
  };

  let currentPage = data?.alih_media?.page || 1;
  let perPage = 10;

  let showDetailModal = false;
  let showDeleteModal = false;
  let selectedDetailModal = null;
  let selectedDeleteModal = null;

  $: alihMediaData = data?.alih_media?.data ?? data?.alih_media ?? [];

  $: filteredAlihMedia = Array.isArray(alihMediaData)
    ? alihMediaData.filter((item) => {
        const matchesRM = values.NoRM
          ? item?.NoRM?.toLowerCase?.().includes(values.NoRM.toLowerCase())
          : true;

        const matchesNamaPasien = values.NamaPasien
          ? item?.NamaPasien?.toLowerCase?.().includes(
              values.NamaPasien.toLowerCase()
            )
          : true;

        return matchesRM && matchesNamaPasien;
      })
    : [];

  $: totalData = data?.alih_media?.total || 0;

  function handlePageChange(page) {
    const params = new URLSearchParams({
      page,
      per_page: perPage,
    });
    goto(`/transaksi/alihmedia?${params.toString()}`);
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
</script>

<div class="mt-12 relative">
  <div class="flex items-center gap-2 mb-3 mt-3">
    <a href="/transaksi/alihmedia/formulir/new">
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
          Filter
          <Icon icon="lucide:chevron-down" class="w-4 h-4 ml-2" />
        </Button>

        {#if filterOpen}
          <form
            method="GET"
            action="/transaksi/alihmedia"
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
              name="NamaPasien"
              type="text"
              bind:value={values.NamaPasien}
              label="Nama Pasien"
              placeholder="John Doe"
            />
            <div class="flex justify-end">
              <Button
                variant="emerald"
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
        href="/api/export/alih-media"
        class="inline-flex items-center px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
      >
        <Icon icon="lucide:download" class="w-4 h-4 mr-2" />
        Export
      </a>
    </div>
  </div>

  <Table
    columns={data.columns}
    data={filteredAlihMedia}
    showAction={true}
    showStatus={true}
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
        href: (row) => `/transaksi/alihmedia/formulir/${row.ID}`,
      },
      { name: "delete", label: "Hapus", color: "text-red-600 hover:bg-red-50" },
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
      title="Detail Alih Media"
      onClose={() => (showDetailModal = false)}
      data={selectedDetailModal}
    >
      <div slot="rekam-medis" class="space-y-3 pb-4">
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
            <p class="text-gray-500">Tanggal Masuk</p>
            <p class="font-medium text-gray-800">
              {selectedDetailModal?.TglMasuk
                ? formatDate(selectedDetailModal.TglMasuk)
                : "-"}
            </p>
          </div>
          <div class="space-y-2">
            <p class="text-gray-500">Jenis Kunjungan</p>
            <p class="font-medium text-gray-800">
              {selectedDetailModal?.JenisKunjungan || "-"}
            </p>
          </div>
          <div class="space-y-2">
            <p class="text-gray-500">Jenis Kasus</p>
            <p class="font-medium text-gray-800">
              {selectedDetailModal?.JenisKasus || "-"}
            </p>
          </div>
        </div>
      </div>

      <div slot="custom-section" class="space-y-3">
        <h3
          class="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center"
        >
          <Icon icon="heroicons:archive-box-20-solid" class="mr-2 w-4 h-4" />
          Alih Media
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="space-y-2">
            <p class="text-gray-500">Tanggal Laporan</p>
            <p class="font-medium text-gray-800">
              {selectedDetailModal?.TglLaporan
                ? formatDate(selectedDetailModal.TglLaporan)
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
        </div>
      </div>
    </DetailModal>
  {/if}

  {#if selectedDeleteModal}
    <DeleteModal
      bind:open={showDeleteModal}
      title="Hapus Transaksi Alih Media"
      onClose={() => (showDeleteModal = false)}
      data={selectedDeleteModal}
      action={"?/delete"}
      {form}
    >
      <div slot="custom-section">
        <h1>
          Yakin ingin menghapus transaksi alih media? <b
            >{selectedDeleteModal?.NamaPasien}</b
          >
        </h1>
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
  import { formatDate } from "$lib/utils/date";
  import { goto } from "$app/navigation";
  import { getStatusClass } from "$lib/utils/statusClass";

  export let data;
  export let form;

  let filterOpen = false;
  let values = {
    NoRM: "",
    NamaPasien: "",
  };

  let currentPage = data?.alih_media?.page || 1;
  const perPage = 10;

  let showDetailModal = false;
  let showDeleteModal = false;
  let selectedDetailModal = null;
  let selectedDeleteModal = null;

  $: filteredAlihMedia = (
    Array.isArray(data?.alih_media?.data)
      ? data.alih_media.data
      : Array.isArray(data?.alih_media)
        ? data.alih_media
        : []
  ).filter((item) => {
    const matchesRM = values.NoRM
      ? item?.NoRM?.toLowerCase?.().includes(values.NoRM.toLowerCase())
      : true;

    const matchesNamaPasien = values.NamaPasien
      ? item?.NamaPasien?.toLowerCase?.().includes(
          values.NamaPasien.toLowerCase()
        )
      : true;

    return matchesRM && matchesNamaPasien;
  });

  $: totalData = data?.alih_media?.total || 0;

  function handlePageChange(page) {
    const params = new URLSearchParams({
      page,
      per_page: perPage,
    });
    goto(`/transaksi/alihmedia?${params.toString()}`);
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
</script>

<div class="mt-12 relative">
  <div class="flex items-center gap-2 mb-3 mt-3">
    <a href="/transaksi/alihmedia/formulir/new">
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
          Filter
          <Icon icon="lucide:chevron-down" class="w-4 h-4 ml-2" />
        </Button>

        {#if filterOpen}
          <form
            method="GET"
            action="/transaksi/alihmedia"
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
              name="NamaPasien"
              type="text"
              bind:value={values.NamaPasien}
              label="Nama Pasien"
              placeholder="John Doe"
            />
            <div class="flex justify-end">
              <Button
                variant="emerald"
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
        href="/api/export/alih-media"
        class="inline-flex items-center px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
      >
        <Icon icon="lucide:download" class="w-4 h-4 mr-2" />
        Export
      </a>
    </div>
  </div>

  <Table
    columns={data.columns}
    data={data?.alih_media?.data || data?.alih_media}
    showAction={true}
    showStatus={true}
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
        href: (row) => `/transaksi/alihmedia/formulir/${row.ID}`,
      },
      { name: "delete", label: "Hapus", color: "text-red-600 hover:bg-red-50" },
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
      title="Detail Alih Media"
      onClose={() => (showDetailModal = false)}
      data={selectedDetailModal}
    >
      <div slot="rekam-medis" class="space-y-3 pb-4">
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
            <p class="text-gray-500">Tanggal Masuk</p>
            <p class="font-medium text-gray-800">
              {selectedDetailModal?.TglMasuk
                ? formatDate(selectedDetailModal.TglMasuk)
                : "-"}
            </p>
          </div>
          <div class="space-y-2">
            <p class="text-gray-500">Jenis Kunjungan</p>
            <p class="font-medium text-gray-800">
              {selectedDetailModal?.JenisKunjungan || "-"}
            </p>
          </div>
          <div class="space-y-2">
            <p class="text-gray-500">Jenis Kasus</p>
            <p class="font-medium text-gray-800">
              {selectedDetailModal?.JenisKasus || "-"}
            </p>
          </div>
        </div>
      </div>

      <div slot="custom-section" class="space-y-3">
        <h3
          class="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center"
        >
          <Icon icon="heroicons:archive-box-20-solid" class="mr-2 w-4 h-4" />
          Alih Media
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="space-y-2">
            <p class="text-gray-500">Tanggal Laporan</p>
            <p class="font-medium text-gray-800">
              {selectedDetailModal?.TglLaporan
                ? formatDate(selectedDetailModal.TglLaporan)
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
        </div>
      </div>
    </DetailModal>
  {/if}

  {#if selectedDeleteModal}
    <DeleteModal
      bind:open={showDeleteModal}
      title="Hapus Transaksi Alih Media"
      onClose={() => (showDeleteModal = false)}
      data={selectedDeleteModal}
      action={"?/delete"}
      {form}
    >
      <div slot="custom-section">
        <h1>
          Yakin ingin menghapus transaksi alih media? <b
            >{selectedDeleteModal?.NamaPasien}</b
          >
        </h1>
      </div>
    </DeleteModal>
  {/if}
</div> -->
