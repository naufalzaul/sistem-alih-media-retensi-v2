<script>
  import Accordion from "$components/Accordion.svelte";
  import { sidebarRoute } from "$route/sidebarRoute";
  import { sidebarOpen } from "$stores/sidebar";
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
  import { goto, invalidateAll } from "$app/navigation";

  export let data;

  let openId = null;
  const toggle = (id) => (openId = openId === id ? null : id);
  const toggleSidebar = () => sidebarOpen.update((v) => !v);

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        await invalidateAll();
        await goto("/login");
      } else {
        console.error("Logout failed:", await response.text());
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
</script>

<div class="flex h-screen bg-gray-50">
  <aside
    class="transition-all duration-300 overflow-y-auto flex flex-col shadow-md bg-gray-50 text-gray-800"
    class:w-64={$sidebarOpen}
    class:w-16={!$sidebarOpen}
  >
    <div
      class="flex items-center justify-between px-4 py-4 border-b border-gray-200"
    >
      {#if $sidebarOpen}
        <div class="flex items-center gap-3">
          <img
            src={data.system?.Logo}
            alt="Logo"
            class="h-8 w-8 object-cover rounded-md"
          />
          <span class="font-bold text-gray-700 leading-tight">
            {data.system?.NamaAplikasi}
            <br />
            <span class="text-xs font-normal text-gray-500"
              >RS Widodo Ngawi</span
            >
          </span>
        </div>
      {/if}
      <button on:click={toggleSidebar} class="text-gray-500 text-xl ml-auto"
        >☰</button
      >
    </div>

    <nav class="mt-4 flex-1 space-y-1 px-2 text-sm">
      {#if data.user?.role}
        {#each sidebarRoute.filter((item) => !item.bottom && item.roles.includes(data.user.role)) as item}
          {#if item.children}
            <Accordion
              {item}
              {toggle}
              isOpen={openId === item.id}
              sidebarOpen={$sidebarOpen}
              setSidebarOpen={() => sidebarOpen.set(true)}
            />
          {:else}
            <a
              href={item.href}
              data-sveltekit-preload-data="off"
              on:click={() => sidebarOpen.set(true)}
              class={`group flex items-center ${$sidebarOpen ? "gap-3 mx-1" : "justify-center"} 
           px-3.5 py-2.5 rounded-md transition-colors duration-200 
           text-sm md:text-[15px] leading-tight
           ${
             item.href === $page.url.pathname
               ? "bg-gray-100 text-emerald-600 font-semibold"
               : "text-gray-600 hover:text-emerald-600 hover:bg-gray-100"
           }`}
            >
              <Icon
                icon={item.icon}
                class={`text-xl font-light transition-colors duration-200
      ${
        item.href === $page.url.pathname
          ? "text-emerald-600"
          : "group-hover:text-emerald-600 text-gray-500"
      }`}
              />
              {#if $sidebarOpen}
                <span>{item.label}</span>
              {/if}
            </a>
          {/if}
        {/each}
      {/if}
    </nav>

    <div class="mt-auto px-2 space-y-1 border-t-2 border-gray-200 py-4 text-sm">
      {#if data.user?.role}
        {#each sidebarRoute.filter((item) => item.bottom && item.roles.includes(data.user.role)) as item}
          {#if item.label === "Keluar"}
            <button
              on:click={handleLogout}
              class={`group flex items-center ${$sidebarOpen ? "gap-3 mx-1" : "justify-center"} 
            px-3.5 py-2.5 rounded-md w-full text-sm md:text-[15px] leading-tight
            text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200`}
            >
              <Icon
                icon={item.icon}
                class={`text-xl transition-colors duration-200 ${
                  $page.url.pathname === item.href
                    ? "text-red-600"
                    : "text-red-500 group-hover:text-red-600"
                }`}
              />
              {#if $sidebarOpen}
                <span class="font-medium">{item.label}</span>
              {/if}
            </button>
          {:else}
            <a
              href={item.href}
              data-sveltekit-preload-data="off"
              on:click={() => sidebarOpen.set(true)}
              class={`group flex items-center ${$sidebarOpen ? "gap-3 mx-1" : "justify-center"} 
            px-3.5 py-2.5 rounded-md transition-colors duration-200 text-sm md:text-[15px] leading-tight
            ${
              item.href === $page.url.pathname
                ? "bg-gray-100 text-emerald-600 font-semibold"
                : "text-gray-600 hover:text-emerald-600 hover:bg-gray-100"
            }`}
            >
              <Icon
                icon={item.icon}
                class={`text-xl font-light transition-colors duration-200 ${
                  item.href === $page.url.pathname
                    ? "text-emerald-600"
                    : "group-hover:text-emerald-600 text-gray-500"
                }`}
              />
              {#if $sidebarOpen}
                <span>{item.label}</span>
              {/if}
            </a>
          {/if}
        {/each}
      {/if}
    </div>
  </aside>

  <div class="flex-1 overflow-y-auto bg-white p-7 space-y-6">
    <slot />
  </div>
</div>
