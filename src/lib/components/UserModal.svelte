<script>
  import { enhance } from "$app/forms";
  import Modal from "$lib/components/Modal.svelte";
  import Input from "$components/Input.svelte";
  import Button from "$components/Button.svelte";
  import Icon from "@iconify/svelte";
  import { createEventDispatcher } from "svelte";

  export let open = false;
  export let onClose = () => {};
  export let data = null;
  export let options = [];

  const dispatch = createEventDispatcher();

  function handleSubmit(e) {
    e.preventDefault();
    dispatch("submit", { id: data?.ID, name, email, role, status });
  }
</script>

<Modal {open} {onClose} size="lg">
  <svelte:fragment slot="header">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Pembaruan Pengguna</h2>
    </div>
  </svelte:fragment>

  <svelte:fragment slot="body">
    <div class="space-y-4 divide-y divide-gray-200">
      <slot name="informasi-pengguna"></slot>
      <slot name="ubah-password"></slot>
    </div>
  </svelte:fragment>
</Modal>
