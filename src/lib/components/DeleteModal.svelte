<script>
  import Modal from "$lib/components/Modal.svelte";
  import Icon from "@iconify/svelte";
  import { enhance } from "$app/forms";
  import { createEventDispatcher } from "svelte";
  import { showToast } from "$lib/utils/ToastAlert.js";

  export let form;
  export let action = "";

  export let open = false;
  export let onClose = () => {};
  export let data = null;
  export let title = "Hapus Data";

  const dispatch = createEventDispatcher();
  $: if (form?.toast) {
    open = false;
    showToast(form.toast.message, form.toast.type, form.redirect);
  }
</script>

<Modal {open} {onClose} size="lg">
  <svelte:fragment slot="header">
    <div class="flex items-start justify-between">
      <div class="overflow-hidden">
        <h2 class="text-2xl font-bold text-gray-900 truncate min-w-[80%]">
          {title}
        </h2>
      </div>
    </div>
  </svelte:fragment>

  <svelte:fragment slot="body">
    <div class="space-y-4 divide-y divide-gray-200">
      <slot name="custom-section"></slot>
    </div>
  </svelte:fragment>

  <svelte:fragment slot="footer">
    <form
      method="POST"
      use:enhance
      {action}
      class="w-full flex justify-end gap-2"
    >
      <input type="hidden" name="id" value={data?.ID || data?.IdKunjungan} />

      <button
        type="button"
        class="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
        on:click={onClose}
      >
        Batal
      </button>

      <button
        type="submit"
        class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 flex items-center gap-1"
      >
        <Icon icon="mdi:trash-can-outline" />
        Hapus
      </button>
    </form>
  </svelte:fragment>
</Modal>
