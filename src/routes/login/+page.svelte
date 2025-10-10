<script>
  import "$src/app.css";
  import { enhance } from "$app/forms";
  import Input from "$components/Input.svelte";
  import Button from "$components/Button.svelte";
  import Icon from "@iconify/svelte";
  import { fadeIn } from "$utils/animations";
  import { onMount } from "svelte";
  import { showToast } from "$lib/utils/ToastAlert.js";
  import ForgotPasswordModal from "$lib/components/ForgotPasswordModal.svelte";

  const eyeIcon = "heroicons:eye";
  const eyeOffIcon = "heroicons:eye-slash";

  export let form;

  let showPassword = false;
  let containerEl;
  let showForgotModal = false;

  onMount(() => fadeIn(containerEl));

  const togglePassword = () => (showPassword = !showPassword);

  $: errors = form?.errors || {};
  $: values = form?.values || {
    email: "",
    password: "",
  };
  $: if (form?.toast)
    showToast(form.toast.message, form.toast.type, form.redirect);
</script>

<main class="min-h-screen flex items-center justify-center p-4 bg-gray-50">
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <svg
      class="absolute right-0 top-0 h-full w-full opacity-40"
      viewBox="0 0 600 600"
      preserveAspectRatio="none"
    >
      <path
        d="M0,160 C150,280 450,40 600,160 L600,600 L0,600 Z"
        fill="#ecfdf5"
      />
      <path
        d="M0,220 C200,340 400,100 600,220 L600,600 L0,600 Z"
        fill="#a7f3d0"
      />
      <path
        d="M0,280 C180,400 420,160 600,280 L600,600 L0,600 Z"
        fill="#6ee7b7"
      />
    </svg>
  </div>

  <div
    bind:this={containerEl}
    class="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden z-10 opacity-0 transition-opacity duration-500"
  >
    <div class="p-8 flex flex-col justify-between">
      <header class="flex items-center gap-3 mb-8 justify-center">
        <img
          src="/logo.jpg"
          alt="Logo RS Widodo Ngawi"
          class="w-8 h-8 rounded"
        />
        <span class="font-semibold text-emerald-700">RS Widodo Ngawi</span>
      </header>

      <div class="w-full space-y-6">
        <div class="space-y-2 text-center">
          <h1 class="text-2xl font-bold text-gray-800">Masuk ke Akun Anda</h1>
          <p class="text-gray-600">
            Gunakan email dan password untuk mengakses sistem
          </p>
        </div>

        <form use:enhance method="POST" class="space-y-5">
          <Input
            name="email"
            label="Email"
            placeholder="emailuser@gmail.com"
            type="email"
            error={errors.email?.[0]}
            bind:value={values.email}
            required
          />

          <Input
            name="password"
            label="Password"
            placeholder="***************"
            type={showPassword ? "text" : "password"}
            suffixIcon={showPassword ? eyeOffIcon : eyeIcon}
            on:suffixClick={togglePassword}
            error={errors.password?.[0]}
            bind:value={values.password}
            required
          />

          <div class="flex items-center justify-between">
            <!-- <div class="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label for="remember" class="ml-2 block text-sm text-gray-600">
                Ingat saya
              </label>
            </div> -->

            <button
              type="button"
              class="text-sm text-emerald-600 hover:underline cursor-pointer"
              on:click={() => (showForgotModal = true)}
            >
              Lupa password?
            </button>
          </div>

          <Button type="submit" variant="emerald" size="md" full>Masuk</Button>
        </form>

        <div
          class="text-center pt-4 border-t border-gray-200 text-sm text-gray-600"
        >
          Belum punya akun?
          <a
            href="/register"
            class="text-emerald-600 font-medium hover:underline ml-1"
          >
            Daftar sekarang
          </a>
        </div>
      </div>
    </div>
  </div>
  {#if showForgotModal}
    <ForgotPasswordModal
      open={showForgotModal}
      title="Lupa Kata Sandi"
      onClose={() => (showForgotModal = false)}
      action={"/login/forgot-password"}
    />
  {/if}
</main>
