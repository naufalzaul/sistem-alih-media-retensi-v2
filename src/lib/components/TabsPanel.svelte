<script>
  import { createTabs, melt } from "@melt-ui/svelte";
  import Icon from "@iconify/svelte";

  export let data;
  export let tabs = [];
  export let defaultTab = tabs[0]?.id ?? "default";
  export let userRole = "";

  const {
    elements: { root, list, trigger, content },
  } = createTabs({ defaultValue: defaultTab });

  $: filteredTabs = tabs.filter(
    (tab) => !tab.roles || tab.roles.includes(userRole)
  );
  $: groups = Array.from(
    new Set(filteredTabs.map((t) => t.group || "Default"))
  );
</script>

<div use:melt={$root} class="flex border-t h-[77vh] border-gray-200 relative">
  <aside
    use:melt={$list}
    class="flex flex-col w-60 pr-4 border-r border-gray-200 sticky top-0 bg-transparent space-y-4"
  >
    {#each groups as grp}
      <div class="flex flex-col space-y-1">
        <div
          class="px-4 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider"
        >
          {grp}
        </div>

        <div class="flex flex-col space-y-1">
          {#each filteredTabs.filter((t) => (t.group || "Default") === grp) as tab}
            <button
              use:melt={$trigger(tab.id)}
              class="flex items-center gap-2 px-4 py-2 text-sm rounded-md cursor-pointer
                   hover:bg-gray-100 text-gray-700 transition
                   data-[state=active]:bg-gray-200 data-[state=active]:font-medium"
            >
              {#if tab.icon}
                <Icon icon={tab.icon} class="w-4 h-4" />
              {/if}
              {tab.title}
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </aside>

  <main class="flex-1 overflow-y-auto p-6">
    {#each filteredTabs as tab}
      <div use:melt={$content(tab.id)} class="animate-fadeIn">
        {#if typeof tab.content === "string"}
          {@html tab.content}
        {:else if tab.content}
          <svelte:component this={tab.content} {data} />
        {/if}
      </div>
    {/each}
  </main>
</div>

<style>
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fadeIn {
    animation: fadeIn 0.25s ease-in-out;
  }
</style>
