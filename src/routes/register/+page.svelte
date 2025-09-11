<script>
  import "$src/app.css";
  import { enhance } from "$app/forms";
  import Input from "$components/Input.svelte";
  import Button from "$components/Button.svelte";
  import Icon from "@iconify/svelte";
  import { fadeIn } from "$utils/animations";
  import { onMount } from "svelte";

  import { showToast } from "$lib/utils/ToastAlert.js";

  const eyeIcon = "heroicons:eye";
  const eyeOffIcon = "heroicons:eye-slash";

  export let form;
  export let data;

  let showPassword = false;
  let showConfirmPassword = false;
  let containerEl;

  onMount(() => {
    fadeIn(containerEl);
  });

  $: errors = form?.errors || {};
  $: values = form?.values || {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  $: if (form?.toast)
    showToast(form.toast.message, form.toast.type, form.redirect);
</script>

<svelte:head>
  <style>
    .toast-message {
      font-family: "Inter", sans-serif;
      border-radius: 8px;
      padding: 12px 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      margin: 10px;
    }
  </style>
</svelte:head>

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
    class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1fr_1fr] bg-white rounded-xl shadow-xl overflow-hidden z-10 opacity-0 transition-opacity duration-500"
  >
    <div class="p-6 md:p-8 lg:p-10 flex flex-col justify-between bg-white">
      <header class="flex items-center gap-3 mb-8">
        <img
          src="/logo.jpg"
          alt="Logo RS Widodo Ngawi"
          class="w-8 h-8 rounded"
        />
        <span class="font-semibold text-emerald-700">RS Widodo Ngawi</span>
      </header>

      <div class="w-full max-w-md mx-auto space-y-6">
        <div class="space-y-2">
          <h1 class="text-2xl md:text-3xl font-semibold text-gray-800">
            Registrasi Akun
          </h1>
          <p class="text-gray-600 text-sm md:text-sm">
            Daftar untuk mengakses sistem alih retensi arsip digital
          </p>
        </div>

        <form use:enhance method="POST" class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-1">
              <Input
                name="name"
                label="Nama Lengkap"
                placeholder="Masukkan nama lengkap"
                error={errors.name?.[0]}
                bind:value={values.name}
                required
              />
            </div>

            <div class="md:col-span-1">
              <Input
                name="email"
                label="Email"
                placeholder="contoh@rsngawi.id"
                type="email"
                error={errors.email?.[0]}
                bind:value={values.email}
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-1">
              <Input
                name="password"
                label="Password"
                placeholder="Masukkan password"
                type={showPassword ? "text" : "password"}
                suffixIcon={showPassword ? eyeOffIcon : eyeIcon}
                on:suffixClick={() => (showPassword = !showPassword)}
                error={errors.password?.[0]}
                required
              >
                <p slot="hint" class="mt-1 text-xs text-gray-500">
                  Minimal 8 karakter, mengandung huruf besar dan angka
                </p>
              </Input>
            </div>

            <div class="md:col-span-1">
              <Input
                name="confirmPassword"
                label="Konfirmasi Password"
                placeholder="Ulangi password"
                type={showConfirmPassword ? "text" : "password"}
                suffixIcon={showConfirmPassword ? eyeOffIcon : eyeIcon}
                on:suffixClick={() =>
                  (showConfirmPassword = !showConfirmPassword)}
                error={errors.confirmPassword?.[0]}
                required
              />
            </div>
          </div>

          <Button type="submit" variant="emerald" size="md" full>
            Daftar Sekarang
          </Button>
        </form>

        <div
          class="text-center pt-4 border-t border-gray-200 text-sm text-gray-600"
        >
          Sudah punya akun?
          <a
            href="/login"
            class="text-emerald-600 font-medium hover:underline ml-1"
          >
            Masuk disini
          </a>
        </div>
      </div>
    </div>

    <div class="relative hidden md:block bg-emerald-800 min-h-[500px]">
      <img
        src="/elen-sher-0dF7UzD2Yd8-unsplash.jpg"
        alt="Digital Medical Records"
        class="absolute inset-0 w-full h-full object-cover object-left-top opacity-90"
      />
      <div class="absolute inset-0 bg-emerald-900/70"></div>

      <div
        class="relative z-20 h-full p-8 lg:p-10 flex flex-col justify-between text-white"
      >
        <div class="space-y-6">
          <h2 class="text-2xl lg:text-3xl font-bold leading-tight">
            Transformasi Digital Rekam Medis
          </h2>
          <p class="text-white/90 leading-relaxed">
            Sistem terpadu untuk manajemen arsip elektronik yang aman dan
            efisien
          </p>
        </div>
        <div class="text-sm text-white/80">
          <p>RS Widodo Ngawi</p>
          <p>Jl. Yos Sudarso No.8, Ngawi, Jawa Timur</p>
        </div>
      </div>
    </div>
  </div>
</main>
