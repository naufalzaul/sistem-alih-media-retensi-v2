<script>
  import { createLabel } from "@melt-ui/svelte";
  import Icon from "@iconify/svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let id = crypto.randomUUID();
  export let name = id;
  export let label = "";
  export let type = "text";
  export let value = "";
  export let placeholder = "";
  export let disabled = false;
  export let readonly = false;
  export let required = false;
  export let error = "";
  export let className = "";

  export let prefixIcon = undefined;
  export let suffixIcon = undefined;
  export let iconClass = "text-gray-400";

  const { elements } = createLabel();
  const { root: labelRoot } = elements;
</script>

<div
  use:labelRoot
  class="flex flex-col items-start w-full space-y-1.5 {className}"
  data-melt-part="root"
>
  {#if label}
    <label
      for={id}
      class="text-sm font-medium text-gray-700 {disabled
        ? 'text-gray-400'
        : ''}"
    >
      {label}
      {#if required}<span class="text-red-500 ml-0.5">*</span>{/if}
    </label>
  {/if}

  <div class="relative w-full">
    {#if prefixIcon}
      <div
        class="absolute inset-y-0 left-0 flex items-center pl-3 {disabled
          ? 'opacity-50'
          : ''}"
      >
        <Icon icon={prefixIcon} class={iconClass} width="18" />
      </div>
    {/if}

    <input
      {id}
      {name}
      {type}
      {placeholder}
      {disabled}
      {readonly}
      {required}
      bind:value
      class={`
        block w-full rounded-md border
        ${error ? "border-red-500" : "border-gray-300"}
        shadow py-2
        ${prefixIcon ? "pl-10" : "pl-3"}
        ${suffixIcon ? "pr-10" : "pr-3"}
        focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50
        disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
        read-only:bg-gray-50 read-only:cursor-default
        transition-colors text-sm
      `}
    />
    {#if suffixIcon}
      <button
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-3 {disabled
          ? 'opacity-50'
          : ''}"
        on:click={() => dispatch("suffixClick")}
      >
        <Icon icon={suffixIcon} class={iconClass} width="18" />
      </button>
    {/if}
  </div>

  {#if error}
    <p class="text-red-600 text-xs mt-1">
      {error}
    </p>
  {/if}
</div>
