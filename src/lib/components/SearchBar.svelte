<script>
  import Button from "$components/Button.svelte";
  import Icon from "@iconify/svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function handleSearch() {
    dispatch("search");
  }
</script>

<form
  class="flex items-stretch divide-x divide-gray-200 mt-6"
  on:submit|preventDefault={handleSearch}
>
  <div
    class="flex flex-1 min-w-0 divide-x divide-gray-200 pl-2 rounded-s-xl border border-gray-200"
  >
    <slot />
  </div>

  <div class="flex items-center">
    <Button
      size="sm"
      type="submit"
      variant="emerald"
      customClass="rounded-l-none rounded-r-xl px-6 h-full"
    >
      <Icon icon="mdi:magnify" class="mr-2 text-base" />
      Cari Data
    </Button>
  </div>
</form>
