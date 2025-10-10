<script>
  import Modal from "$lib/components/Modal.svelte";
  import Input from "$components/Input.svelte";
  import Button from "$components/Button.svelte";
  import Icon from "@iconify/svelte";
  import { enhance } from "$app/forms";
  import { showToast } from "$lib/utils/ToastAlert.js";

  export let open = false;
  export let onClose = () => {};
  export let action = "";
  export let title = "Reset Password";

  export let errors = {};
  export let form;

  $: errors = form?.errors || {};
  $: values = form?.values || { email: "naufalzaulkarim@gmail.com" };
</script>

<Modal {open} {onClose} size="sm">
  <svelte:fragment slot="header">
    <div class="space-y-3">
      <div
        class="bg-emerald-50 text-emerald-600 rounded-full w-fit p-3 shadow-md flex items-center justify-center mx-auto"
      >
        <Icon icon="mdi:alert-octagon" class="w-8 h-8" />
      </div>

      <h2 class="text-2xl font-bold text-gray-800 text-center">
        {title}
      </h2>
      <p class="text-gray-500 text-center">
        Masukkan alamat email yang terdaftar. Kami akan mengirimkan link reset
        password ke email tersebut.
      </p>
    </div>
  </svelte:fragment>

  <svelte:fragment slot="body">
    <form
      method="POST"
      use:enhance={() => {
        return async ({ update, result }) => {
          if (result?.toast) {
            showToast(result.toast.message, result.toast.type);
            onClose();
          }
          await update({ reset: true });
        };
      }}
      {action}
      class="space-y-4"
    >
      <Input
        name="email"
        label="Email"
        placeholder="emailuser@gmail.com"
        type="email"
        error={errors.email?.[0]}
        bind:value={values.email}
        required
      />

      <div class="flex justify-end gap-5 pt-2">
        <Button
          type="button"
          variant="default"
          size="md"
          full
          on:click={onClose}
        >
          Batal
        </Button>

        <Button type="submit" variant="emerald" size="md" full>Kirim</Button>
      </div>
    </form>
  </svelte:fragment>
</Modal>
