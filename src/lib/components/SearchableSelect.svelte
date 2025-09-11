<script>
  import { createEventDispatcher } from "svelte";
  import Icon from "@iconify/svelte";

  export let id = Math.random().toString(36).substring(2, 9);
  export let name = "";
  export let selected;
  export let options = [];
  export let placeholder = "Pilih opsi";
  export let disabled = false;
  export let emptyMessage = "Tidak ada hasil";
  export let required = false;
  export let label = "";
  export let error = "";
  export let className =
    "border border-gray-300 rounded-md shadow focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500";

  let searchTerm = selected || "";
  let showDropdown = false;
  let inputRef;
  const dispatch = createEventDispatcher();

  $: if (selected && selected !== searchTerm) {
    searchTerm = selected;
  }

  $: filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleSelect(option) {
    selected = option;
    searchTerm = option;
    showDropdown = false;
    dispatch("change", option);
  }

  function clearSelection() {
    selected = "";
    searchTerm = "";
    dispatch("change", "");
  }

  function handleInputClick() {
    if (!disabled) showDropdown = true;
  }

  function handleBlur() {
    setTimeout(() => {
      showDropdown = false;
      if (selected && !options.includes(searchTerm)) {
        searchTerm = selected;
      }
    }, 200);
  }
</script>

<div class="relative w-full">
  {#if label}
    <label
      for={id}
      class="block text-sm font-medium {disabled
        ? 'text-gray-400'
        : 'text-gray-700'} mb-1.5"
    >
      {label}
      {#if required}<span class="text-red-500 ml-1">*</span>{/if}
    </label>
  {/if}

  <div class="relative">
    <input
      {id}
      {name}
      bind:this={inputRef}
      type="text"
      bind:value={searchTerm}
      class={`w-full px-4 py-2 pr-10 text-sm bg-white text-gray-800
             focus:outline-none
             ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
             ${className}`}
      {placeholder}
      {disabled}
      on:click={handleInputClick}
      on:blur={handleBlur}
    />

    {#if selected && !disabled}
      <button
        type="button"
        class="absolute inset-y-0 right-6 flex items-center pr-2"
        on:click|stopPropagation={clearSelection}
      >
        <Icon
          icon="heroicons:x-mark"
          class="h-4 w-4 text-gray-400 hover:text-gray-600"
        />
      </button>
    {/if}

    <div
      class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
    >
      <Icon icon="heroicons:chevron-down" class="h-4 w-4 text-gray-400" />
    </div>

    {#if showDropdown && !disabled}
      <ul
        class="absolute top-full left-0 z-10 w-full mt-1 bg-white border border-gray-200 shadow-lg rounded-md py-1 max-h-60 overflow-auto"
      >
        {#if filteredOptions.length === 0}
          <li class="px-4 py-2 text-gray-500 text-sm">{emptyMessage}</li>
        {:else}
          {#each filteredOptions as option}
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <li
              class={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                option === selected ? "bg-gray-100 font-medium" : ""
              }`}
              on:mousedown|preventDefault={() => handleSelect(option)}
            >
              {option}
            </li>
          {/each}
        {/if}
      </ul>
    {/if}
  </div>

  {#if error}
    <p class="text-red-500 text-xs mt-1">{error}</p>
  {/if}
</div>
