<script>
  import { createEventDispatcher, onMount } from "svelte";
  import Icon from "@iconify/svelte";

  export let open = false;
  export let closeOnOutsideClick = true;
  export let closeOnEsc = true;
  export let preventScroll = true;

  const dispatch = createEventDispatcher();
  export let onClose = () => {};

  function closeModal() {
    open = false;
    dispatch("close");
    onClose();
  }

  function handleKeydown(e) {
    if (closeOnEsc && e.key === "Escape") {
      closeModal();
    }
  }

  function handleOutsideClick(event) {
    if (closeOnOutsideClick && event.target === event.currentTarget) {
      closeModal();
    }
  }

  function toggleBodyScroll(disable) {
    if (preventScroll) {
      document.body.style.overflow = disable ? "hidden" : "";
    }
  }

  onMount(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
      toggleBodyScroll(false);
    };
  });

  $: if (open) {
    toggleBodyScroll(true);
  } else {
    toggleBodyScroll(false);
  }
</script>

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm modal-overlay"
    on:click={handleOutsideClick}
    role="dialog"
    aria-modal="true"
  >
    <div
      class="bg-white rounded-2xl p-6 shadow-xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto"
    >
      <button
        class="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition"
        on:click={closeModal}
        aria-label="Tutup"
      >
        <Icon icon="mdi:close" class="w-6 h-6" />
      </button>

      <header class="mb-4">
        <slot name="header" />
      </header>

      <main class="space-y-4">
        <slot name="body" />
      </main>

      <footer class="mt-6">
        <slot name="footer" />
      </footer>
    </div>
  </div>
{/if}
