<script>
  import Icon from "@iconify/svelte";
  import Table from "$components/Table.svelte";
  import Pagination from "$components/Pagination.svelte";
  import Button from "$components/Button.svelte";
  import Input from "$components/Input.svelte";
  import DetailModal from "$lib/components/DetailModal.svelte";
  import DeleteModal from "$lib/components/DeleteModal.svelte";
  import IEModal from "$lib/components/IEModal.svelte";
  import { goto } from "$app/navigation";

  export let data;
  export let form;

  let filterOpen = false;
  let values = {
    NoRM: "",
    NIK: "",
    NamaPasien: "",
  };

  let currentPage = data?.pasien?.page || 1;
  const perPage = 5;

  let showDetailModal = false;
  let showDeleteModal = false;
  let showImportModal = false;
  let selectedDetailModal = null;
  let selectedDeleteModal = null;
  let selectedImportModal = null;

  $: pasienData = data?.pasien?.data ?? data?.pasien ?? [];

  $: filteredPatients = Array.isArray(pasienData)
    ? pasienData.filter((pasien) => {
        const matchesRM = values.NoRM
          ? pasien.NoRM?.toLowerCase().includes(values.NoRM.toLowerCase())
          : true;
        const matchesNIK = values.NIK
          ? pasien.NIK?.toLowerCase().includes(values.NIK.toLowerCase())
          : true;
        const matchesNamaPasien = values.NamaPasien
          ? pasien.NamaPasien?.toLowerCase().includes(
              values.NamaPasien.toLowerCase()
            )
          : true;
        return matchesRM && matchesNIK && matchesNamaPasien;
      })
    : [];

  $: totalData = data?.pasien?.total || 0;

  function handlePageChange(page) {
    const params = new URLSearchParams({
      page,
      per_page: perPage,
    });
    goto(`/pasien?${params.toString()}`);
  }

  function handleAction({ type, detail }) {
    if (type === "view") {
      selectedDetailModal = detail;
      showDetailModal = true;
    } else if (type === "delete") {
      selectedDeleteModal = detail;
      showDeleteModal = true;
    } else if (type === "import") {
      selectedImportModal = detail;
      showImportModal = true;
    }
  }
</script>

<div class="mt-12 relative">
  <div class="flex items-center gap-2 mb-3">
    <a href="/pasien/formulir/new">
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
          Filter Pasien
          <Icon icon="lucide:chevron-down" class="w-4 h-4 ml-2" />
        </Button>

        {#if filterOpen}
          <form
            method="GET"
            action="/pasien"
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
              placeholder="1234567890"
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
              >
                Submit
              </Button>
            </div>
          </form>
        {/if}
      </div>

      <Button
        variant="outline"
        rounded="lg"
        size="sm"
        on:click={() => handleAction({ type: "import" })}
      >
        <Icon icon="lucide:upload" class="w-4 h-4 mr-2" />
        Import
      </Button>

      <a
        href="/api/export/pasien"
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
        href: (row) => `/pasien/formulir/${row.ID}`,
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
      title="Detail Pasien"
      onClose={() => (showDetailModal = false)}
      data={selectedDetailModal}
    />
  {/if}

  {#if selectedDeleteModal}
    <DeleteModal
      bind:open={showDeleteModal}
      title="Delete Pasien"
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

  {#if showImportModal}
    <IEModal
      bind:open={showImportModal}
      action={"?/import"}
      title="Dokumen Pasien"
      onClose={() => (showImportModal = false)}
      {form}
    />
  {/if}
</div>
