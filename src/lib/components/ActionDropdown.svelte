<script>
  import Icon from "@iconify/svelte";
  import { createEventDispatcher } from "svelte";

  export let showLeft = false;

  let isMainOpen = false;
  let isSubOpen = false;
  let submenuEl;
  let closeTimeout;

  const dispatch = createEventDispatcher();

  function openMain() {
    clearTimeout(closeTimeout);
    isMainOpen = true;
  }

  function closeMain() {
    closeTimeout = setTimeout(() => {
      isMainOpen = false;
      isSubOpen = false;
    }, 200);
  }

  function openSub() {
    clearTimeout(closeTimeout);
    isSubOpen = true;
    adjustSubmenuPosition();
  }

  function closeSub() {
    closeTimeout = setTimeout(() => {
      isSubOpen = false;
    }, 200);
  }

  function adjustSubmenuPosition() {
    if (!submenuEl || showLeft) return;
    const rect = submenuEl.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      submenuEl.classList.remove("left-full", "ml-1");
      submenuEl.classList.add("right-full", "mr-1");
    } else {
      submenuEl.classList.remove("right-full", "mr-1");
      submenuEl.classList.add("left-full", "ml-1");
    }
  }

  function handleAction(name) {
    dispatch("action", { name });
    isMainOpen = false;
    isSubOpen = false;
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="relative inline-block text-left"
  on:mouseenter={openMain}
  on:mouseleave={closeMain}
>
  <button
    class="text-gray-500 hover:text-emerald-600 transition p-1"
    aria-label="Aksi"
  >
    <Icon icon="mdi:dots-vertical" class="w-5 h-5" />
  </button>

  {#if isMainOpen}
    <div
      class="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md border border-gray-200 bg-white shadow-md divide-y divide-gray-200"
    >
      <ul class="py-1 text-sm text-gray-700">
        <slot name="main" {handleAction} />
      </ul>
      {#if $$slots.sub}
        <ul class="py-1 text-sm text-gray-700">
          <li class="relative" on:mouseenter={openSub} on:mouseleave={closeSub}>
            <div
              class="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <span>Aktivasi</span>
              <Icon icon="mdi:chevron-right" class="w-4 h-4 text-gray-400" />
            </div>

            {#if isSubOpen}
              <div
                bind:this={submenuEl}
                class="absolute top-0 w-48 rounded-md border border-gray-200 bg-white shadow-md transition-all"
                class:left-full={!showLeft}
                class:ml-1={!showLeft}
                class:right-full={showLeft}
                class:mr-1={showLeft}
              >
                <ul class="py-1 text-sm text-gray-700">
                  <slot name="sub" {handleAction} />
                </ul>
              </div>
            {/if}
          </li>
        </ul>
      {/if}
    </div>
  {/if}
</div>
