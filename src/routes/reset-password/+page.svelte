<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { enhance } from "$app/forms";
  import { showToast } from "$lib/utils/ToastAlert.js";
  import Input from "$components/Input.svelte";
  import Button from "$components/Button.svelte";
  import Icon from "@iconify/svelte";

  export let form;
  export let data;

  let token = "";
  let showPassword = false;

  const eyeIcon = "heroicons:eye";
  const eyeOffIcon = "heroicons:eye-slash";

  onMount(() => {
    token = $page.url.searchParams.get("token") || "";
  });

  const togglePassword = () => (showPassword = !showPassword);

  $: errors = form?.errors || {};
  $: values = form?.values || { new_password: "" };

  $: console.log(form);
  $: if (form?.toast)
    showToast(form.toast.message, form.toast.type, form.redirect);
</script>

<div class="flex items-center justify-center min-h-screen bg-emerald-50 p-4">
  <form
    method="POST"
    use:enhance
    class="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-emerald-100 space-y-6"
  >
    <div class="space-y-3">
      <div
        class="bg-emerald-50 text-emerald-600 rounded-full w-fit p-3 shadow-md flex items-center justify-center mx-auto"
      >
        <Icon icon="mdi:lock-reset" class="w-8 h-8" />
      </div>

      <h2 class="text-2xl font-bold text-gray-800 text-center">
        Ubah Password
      </h2>
      <p class="text-gray-500 text-center">
        Masukkan password baru Anda di bawah ini untuk mengamankan akun Anda.
      </p>
    </div>

    <input type="hidden" name="token" value={token} />

    <Input
      name="new_password"
      label="Password Baru"
      placeholder="Masukkan password baru"
      type={showPassword ? "text" : "password"}
      suffixIcon={showPassword ? eyeOffIcon : eyeIcon}
      on:suffixClick={togglePassword}
      error={errors.new_password?.[0]}
      bind:value={values.new_password}
      required
      minlength="6"
    />

    <Button type="submit" variant="emerald" size="md" full>
      Simpan Password
    </Button>
  </form>
</div>
