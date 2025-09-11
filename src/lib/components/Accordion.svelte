<script>
  import Icon from "@iconify/svelte";
  import { page } from "$app/stores";
  import { slide } from "svelte/transition";

  export let item;
  export let isOpen = false;
  export let toggle = () => {};
  export let sidebarOpen = true;
  export let setSidebarOpen = () => {};
  const isChildActive = (children) =>
    children.some((c) => c.href === $page.url.pathname);
</script>

<div class="overflow-hidden space-y-1">
  <button
    class={`group flex items-center w-full px-3.5 py-2.5 rounded-md text-sm md:text-[15px] leading-tight
    transition-colors duration-200
    ${
      isChildActive(item.children) || isOpen
        ? "bg-emerald-600/10 text-emerald-600 font-semibold"
        : "text-gray-600 hover:bg-gray-100 hover:text-emerald-600"
    }
    ${sidebarOpen ? "mx-1 gap-3" : "justify-center"}`}
    on:click={() => {
      toggle(item.id);
      setSidebarOpen(true);
    }}
  >
    <Icon
      icon={item.icon}
      class={`text-xl min-w-[20px] transition-colors duration-200
      ${
        isChildActive(item.children) || isOpen
          ? "text-emerald-600"
          : "text-gray-500 group-hover:text-emerald-600"
      }`}
    />

    {#if sidebarOpen}
      <span class="flex-1 text-left truncate">{item.label}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class={`w-4 h-4 min-w-[16px] transform transition-transform duration-200
        ${isOpen ? "rotate-90" : ""}
        ${isChildActive(item.children) || isOpen ? "text-emerald-600" : "text-gray-400"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    {/if}
  </button>

  {#if isOpen}
    <div class="overflow-hidden" transition:slide|local>
      <div class="ml-4 space-y-1 mt-1">
        {#each item.children as child}
          <a
            href={child.href}
            on:click={() => setSidebarOpen(true)}
            class={`group flex items-center px-3 py-2 rounded-md text-[13px]
              ${
                $page.url.pathname === child.href
                  ? "bg-emerald-600/10 text-emerald-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-emerald-600"
              }
              ${sidebarOpen ? "gap-2" : "justify-center"}`}
          >
            <Icon
              icon={child.icon}
              class={`text-[18px] min-w-[18px]
                ${
                  $page.url.pathname === child.href
                    ? "text-emerald-600"
                    : "text-gray-500 group-hover:text-emerald-600"
                }`}
            />
            {#if sidebarOpen}
              <span class="truncate">{child.label}</span>
            {/if}
          </a>
        {/each}
      </div>
    </div>
  {/if}
</div>
