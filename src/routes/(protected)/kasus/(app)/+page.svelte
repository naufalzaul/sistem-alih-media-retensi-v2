<script>
  import Icon from "@iconify/svelte";
  import Table from "$components/Table.svelte";
  import Pagination from "$components/Pagination.svelte";
  import SearchBar from "$components/SearchBar.svelte";
  import DeleteModal from "$lib/components/DeleteModal.svelte";
  import Button from "$components/Button.svelte";
  import Input from "$components/Input.svelte";
  import DetailModal from "$lib/components/DetailModal.svelte";
  import IEModal from "$lib/components/IEModal.svelte";
  import { goto } from "$app/navigation";

  export let data;
  export let form;

  let filterOpen = false;
  let values = {
    JenisKasus: "",
  };

  let currentPage = data?.kasus?.page || 1;
  const perPage = 5;

  let showDeleteModal = false;
  let showImportModal = false;
  let selectedDeleteModal = null;
  let selectedImportModal = null;

  $: kasusData = data?.kasus?.data ?? data?.kasus ?? [];

  $: filteredPatients = Array.isArray(kasusData)
    ? kasusData.filter((kasus) => {
        const matchesJK = values.JenisKasus
          ? kasus.JenisKasus?.toLowerCase().includes(
              values.JenisKasus.toLowerCase()
            )
          : true;
        return matchesJK;
      })
    : [];

  $: totalData = data?.kasus?.total || 0;

  function handlePageChange(page) {
    const params = new URLSearchParams({
      page,
      per_page: perPage,
    });
    goto(`/kasus?${params.toString()}`);
  }

  function handleAction({ type, detail }) {
    if (type === "delete") {
      selectedDeleteModal = detail;
      showDeleteModal = true;
    }
  }
</script>

<div class="mt-12 relative">
  <div class="flex items-center gap-2 mb-3">
    <a href="/kasus/formulir/new">
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
          Filter Kasus
          <Icon icon="lucide:chevron-down" class="w-4 h-4 ml-2" />
        </Button>

        {#if filterOpen}
          <form
            method="GET"
            action="/kasus"
            class="absolute right-0 mt-2 w-72 rounded-md shadow bg-white ring-1 ring-gray-200 z-50 p-4 space-y-3"
          >
            <Input
              name="JenisKasus"
              type="text"
              bind:value={values.JenisKasus}
              label="Jenis Kasus"
              placeholder="Paru-paru"
            />

            <div class="flex justify-end">
              <Button
                type="submit"
                variant="emerald"
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
    </div>
  </div>

  <Table
    columns={data.columns}
    data={kasusData}
    showAction={true}
    actions={[
      {
        name: "edit",
        label: "Edit",
        color: "text-gray-600 hover:bg-gray-50",
        href: (row) => `/kasus/formulir/${row.ID}`,
      },
      {
        name: "delete",
        label: "Hapus",
        color: "text-red-600 hover:bg-red-50",
      },
    ]}
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

  {#if showDeleteModal}
    <DeleteModal
      bind:open={showDeleteModal}
      title="Delete Kasus"
      onClose={() => (showDeleteModal = false)}
      data={selectedDeleteModal}
      action={"?/delete"}
      {form}
    >
      <div slot="custom-section">
        <h1>Yakin ingin menghapus data? {selectedDeleteModal.JenisKasus}</h1>
      </div>
    </DeleteModal>
  {/if}

  {#if showImportModal}
    <IEModal
      bind:open={showImportModal}
      action={"?/import"}
      title="Dokumen Kasus"
      onClose={() => (showImportModal = false)}
      {form}
    />
  {/if}
</div>
