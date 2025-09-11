<script>
  import Icon from "@iconify/svelte";
  import Table from "$components/Table.svelte";
  import Pagination from "$components/Pagination.svelte";
  import Button from "$components/Button.svelte";
  import Input from "$components/Input.svelte";
  import DetailModal from "$lib/components/DetailModal.svelte";
  import DeleteModal from "$lib/components/DeleteModal.svelte";
  import SearchableSelect from "$components/SearchableSelect.svelte";

  export let data;
  export let form;

  let filterOpen = false;
  let values = {
    transaction: null,
    category: null,
  };

  let currentPage = 1;
  const perPage = 10;

  let showDetailModal = false;
  let showDeleteModal = false;
  let selectedDetailModal = null;
  let selectedDeleteModal = null;

  let filteredData = [];

  $: {
    filteredData = data.laporanData.filter((row) => {
      const matchTrans = values.transaction
        ? row.transaksi === values.transaction
        : true;
      const matchCat = values.category
        ? row.kategori === values.category
        : true;
      return matchTrans && matchCat;
    });
  }

  $: paginatedData = filteredData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  function handleSubmit() {
    currentPage = 1;
    filterOpen = false;
  }

  function handlePageChange(page) {
    currentPage = page;
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
  <div class="flex items-center gap-2 mb-3">
    <Button variant="outline" rounded="lg" size="sm">
      <Icon icon="lucide:file-text" class="w-4 h-4 mr-2" />
      Export PDF
    </Button>

    <Button variant="outline" rounded="lg" size="sm">
      <Icon icon="lucide:file-spreadsheet" class="w-4 h-4 mr-2" />
      Export Excel
    </Button>

    <div class="flex items-center gap-2 ml-auto">
      <div class="relative inline-block">
        <Button
          variant="outline"
          rounded="lg"
          size="sm"
          on:click={() => (filterOpen = !filterOpen)}
        >
          <Icon icon="lucide:search" class="w-4 h-4 mr-2" />
          Filter Data
          <Icon icon="lucide:chevron-down" class="w-4 h-4 ml-2" />
        </Button>

        {#if filterOpen}
          <div
            class="absolute right-0 mt-2 w-72 rounded-md shadow bg-white ring-1 ring-gray-200 z-50 p-4 space-y-3"
          >
            <SearchableSelect
              name="transaction"
              label="Transaksi"
              options={data.selectByTransaction}
              bind:selected={values.transaction}
              placeholder="Pilih transaksi"
            />

            <SearchableSelect
              name="category"
              label="Kategori"
              options={data.selectByCategory}
              bind:selected={values.category}
              placeholder="Pilih kategori"
            />

            <div class="flex justify-end">
              <Button
                size="sm"
                class="bg-blue-600 text-white hover:bg-blue-700"
                on:click={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <Table
    columns={data.laporanColumns}
    data={paginatedData}
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
        href: (row) => `/laporan/formulir/${row.nomor_rm}`,
      },
      { name: "delete", label: "Hapus", color: "text-red-600 hover:bg-red-50" },
    ]}
    on:view={handleAction}
    on:edit={handleAction}
    on:delete={handleAction}
  >
    <svelte:fragment slot="pagination">
      <Pagination
        total={filteredData.length}
        {perPage}
        defaultPage={currentPage}
        onPageChange={handlePageChange}
      />
    </svelte:fragment>
  </Table>

  {#if selectedDetailModal}
    <DetailModal
      bind:open={showDetailModal}
      title="Detail Laporan"
      onClose={() => (showDetailModal = false)}
      data={selectedDetailModal}
    />
  {/if}

  {#if selectedDeleteModal}
    <DeleteModal
      bind:open={showDeleteModal}
      title="Hapus Laporan"
      onClose={() => (showDeleteModal = false)}
      data={selectedDeleteModal}
      action="?/delete"
      {form}
    >
      <div slot="custom-section">
        <h1>Yakin ingin menghapus data {selectedDeleteModal.nama_pasien}?</h1>
      </div>
    </DeleteModal>
  {/if}
</div>
