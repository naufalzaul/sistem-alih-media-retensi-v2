<script>
  export let variant = "default";
  export let type = "button";
  export let full = false;
  export let rounded = "md";
  export let size = "md";
  export let iconOnly = false;
  export let menuItem = false;
  export let customClass = "";
  export let disabled = false;
  export let loading = false;

  const variants = {
    emerald: `
      bg-emerald-600 hover:bg-emerald-700 
      focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
      text-white shadow-sm
      disabled:bg-emerald-400 disabled:cursor-not-allowed
    `,
    danger: `
      bg-red-600 hover:bg-red-700 
      focus:ring-2 focus:ring-red-500 focus:ring-offset-2
      text-white shadow-sm
      disabled:bg-red-400 disabled:cursor-not-allowed
    `,
    dark: `
      bg-gray-800 hover:bg-gray-900 border border-gray-700
      focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
      text-gray-100 shadow
      disabled:bg-gray-600 disabled:cursor-not-allowed
    `,
    outline: `
      bg-transparent border border-gray-300 hover:border-gray-400
      focus:ring-2 focus:ring-gray-300 focus:ring-offset-2
      text-gray-700 hover:text-gray-900
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    ghost: `
      bg-transparent hover:bg-gray-100
      focus:ring-2 focus:ring-gray-200
      text-gray-700
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    link: `
      bg-transparent hover:underline
      text-emerald-600 hover:text-emerald-800
      p-0
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    default: `
      bg-gray-100 hover:bg-gray-200
      focus:ring-2 focus:ring-gray-300 focus:ring-offset-2
      text-gray-700
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
  };

  const sizes = {
    xs: "px-2.5 py-1.5 text-xs",
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  $: baseClasses = `
    inline-flex items-center justify-center
    font-medium
    transition-all duration-200 ease-in-out
    ${full ? "w-full" : ""}
    ${iconOnly ? "p-2" : sizes[size]}
    ${menuItem ? "items-start justify-start text-left text-sm w-full" : ""}
    ${roundedStyles[rounded]}
    ${variants[variant]}
    ${customClass}
  `
    .replace(/\s+/g, " ")
    .trim();
</script>

<button {type} class={baseClasses} {disabled} on:click>
  {#if loading}
    <span class="inline-flex items-center">
      <svg
        class="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <slot name="loading">Processing...</slot>
    </span>
  {:else}
    <slot />
  {/if}
</button>

<!-- 
<Button variant="emerald" size="lg">Submit Form</Button>

<Button variant="emerald" loading={true}>
  <span slot="loading">Saving...</span>
</Button>

<Button variant="outline" iconOnly rounded="full">
  <Icon icon="heroicons:plus" />
</Button>

<Button variant="link">View Details</Button> -->
