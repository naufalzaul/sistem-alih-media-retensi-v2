<script>
  import { createPagination } from "@melt-ui/svelte";
  import Icon from "@iconify/svelte";
  import { onMount, onDestroy } from "svelte";

  export let total = 100;
  export let perPage = 10;
  export let siblingCount = 1;
  export let defaultPage = 1;
  export let onPageChange = (page) => {};

  const {
    elements: { root, pageTrigger, prevButton, nextButton },
    states: { pages, page },
  } = createPagination({
    count: total,
    perPage,
    defaultPage,
    siblingCount,
  });

  let unsubscribe;
  onMount(() => {
    unsubscribe = page.subscribe((p) => {
      defaultPage = p;
      onPageChange(p);
    });
  });
  onDestroy(() => unsubscribe?.());
</script>

<nav
  class="flex flex-col items-end gap-3 py-10"
  aria-label="Pagination"
  use:melt={$root}
>
  <div class="flex items-center gap-1">
    <button
      use:melt={$prevButton}
      class="grid h-8 w-8 place-items-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50"
      aria-label="Sebelumnya"
    >
      <Icon icon="mdi:chevron-left" class="w-4 h-4" />
    </button>

    {#each $pages as p (p.key)}
      {#if p.type === "ellipsis"}
        <span class="px-2 text-gray-400">...</span>
      {:else}
        <button
          use:melt={$pageTrigger(p)}
          class="px-3 py-1 rounded-md text-sm font-medium transition border
            {p.value === defaultPage
            ? 'bg-emerald-600 text-white border-emerald-600'
            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}"
        >
          {p.value}
        </button>
      {/if}
    {/each}

    <button
      use:melt={$nextButton}
      class="grid h-8 w-8 place-items-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50"
      aria-label="Selanjutnya"
    >
      <Icon icon="mdi:chevron-right" class="w-4 h-4" />
    </button>
  </div>
</nav>
