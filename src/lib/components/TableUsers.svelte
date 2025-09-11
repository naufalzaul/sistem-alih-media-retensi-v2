<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";
  import Icon from "@iconify/svelte";
  import { localData } from "$lib/stores/localData";
  import { goto } from "$app/navigation";
  import { showToast } from "$lib/utils/ToastAlert.js";
  import { getStatusClass } from "$lib/utils/statusClass";
  import { formatDate } from "$lib/utils/date";

  export let columns = [];
  export let data = [];
  export let showAction = false;
  export let showStatus = false;
  export let actions = [];

  let activeDropdownId = null;
  const dispatch = createEventDispatcher();

  function handleClickOutside(event) {
    if (!event.target.closest(".action-dropdown")) {
      activeDropdownId = null;
    }
  }

  onMount(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  });

  function toggleDropdown(rowId, event) {
    event.stopPropagation();
    activeDropdownId = activeDropdownId === rowId ? null : rowId;
  }

  function handleAction(row, actionName, event) {
    event?.preventDefault?.();
    dispatch(actionName, row);
    activeDropdownId = null;
  }
</script>

<div class="relative">
  <div class="overflow-x-auto mt-5">
    <div class="inline-block min-w-full align-middle">
      <div class="bg-white border border-gray-200 rounded-xl">
        <table class="min-w-full text-sm text-gray-800 text-center">
          <thead class="bg-gray-100">
            <tr>
              <th
                class="px-6 py-3 uppercase text-xs tracking-wider text-emerald-700 rounded-tl-xl"
                >No</th
              >
              {#each columns as col, i}
                <th
                  class="px-6 py-3 uppercase text-xs tracking-wider text-emerald-700
                  {!showStatus && !showAction && i === columns.length - 1
                    ? 'rounded-tr-xl'
                    : ''}"
                >
                  {col.label}
                </th>
              {/each}
              {#if showStatus}
                <th
                  class="px-6 py-3 text-center uppercase text-xs tracking-wider text-emerald-700
                  {!showAction ? 'rounded-tr-xl' : ''}"
                >
                  Status
                </th>
              {/if}
              {#if showAction}
                <th
                  class="px-6 py-3 text-center uppercase text-xs tracking-wider text-emerald-700 rounded-tr-xl"
                >
                  Aksi
                </th>
              {/if}
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200">
            {#each data as row, index}
              <tr class="hover:bg-gray-50 transition">
                <td
                  class="px-6 py-4 text-gray-600
                  {index === data.length - 1 ? 'rounded-bl-xl' : ''}"
                >
                  {index + 1}
                </td>

                {#each columns as col, i}
                  <td
                    class="px-6 py-4 max-w-xs truncate
  {index === data.length - 1 &&
                    i === columns.length - 1 &&
                    !showStatus &&
                    !showAction
                      ? 'rounded-br-xl'
                      : ''}"
                  >
                    {#if col.key.toLowerCase().includes("tgl") || col.key
                        .toLowerCase()
                        .includes("tanggal")}
                      {#if row[col.key]}
                        {formatDate(row[col.key])}
                      {:else}
                        -
                      {/if}
                    {:else}
                      {row[col.key] || "-"}
                    {/if}
                  </td>
                {/each}

                {#if showStatus}
                  <td
                    class="px-6 py-4 text-center whitespace-nowrap w-fit
    {index === data.length - 1 && !showAction ? 'rounded-br-xl' : ''}"
                  >
                    <span
                      class={`inline-block text-xs font-medium px-3 py-1 rounded-full ${getStatusClass(row.Status || row.status)}`}
                    >
                      {row.Status || row.status}
                    </span>
                  </td>
                {/if}

                {#if showAction}
                  <td class="px-6 py-4 text-center relative">
                    <div class="action-dropdown inline-block">
                      <button
                        type="button"
                        class="inline-flex items-center justify-center rounded-full p-1 hover:bg-gray-200 transition-colors"
                        on:click|stopPropagation={(e) =>
                          toggleDropdown(index, e)}
                        aria-label="Action menu"
                        aria-expanded={activeDropdownId === index}
                      >
                        <Icon
                          icon="mdi:dots-vertical"
                          class="text-gray-600 w-5 h-5"
                        />
                      </button>

                      {#if activeDropdownId === index}
                        <!-- svelte-ignore a11y_interactive_supports_focus -->
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <!-- svelte-ignore a11y_invalid_attribute -->
                        <div
                          class="origin-top-right absolute right-5 mt-2 w-52 rounded-md shadow bg-white ring-1 ring-gray-200 ring-opacity-5 z-50"
                          on:click|stopPropagation
                          transition:fly={{ y: -10, duration: 150 }}
                          role="menu"
                        >
                          <div class="py-1" role="none">
                            {#each actions as action}
                              {#if action.href}
                                <a
                                  href="#"
                                  on:click|preventDefault={() => {
                                    localData.update((d) => ({
                                      ...d,
                                      dataTemp: row,
                                    }));
                                    goto(action.href(row));
                                  }}
                                  class={`${action.color} w-full text-left px-4 py-2 text-sm flex items-center gap-2`}
                                >
                                  <Icon icon={action.icon} class="w-4 h-4" />
                                  {action.label}
                                </a>
                              {:else}
                                <button
                                  class={`${action.color} w-full text-left px-4 py-2 text-sm flex items-center gap-2`}
                                  role="menuitem"
                                  on:click|preventDefault={(e) =>
                                    handleAction(row, action.name, e)}
                                >
                                  <Icon icon={action.icon} class="w-4 h-4" />
                                  {action.label}
                                </button>
                              {/if}
                            {/each}
                          </div>
                        </div>
                      {/if}
                    </div>
                  </td>
                {/if}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
    <slot name="pagination" />
  </div>
</div>
