<script>
  import { enhance } from "$app/forms";
  import Button from "$components/Button.svelte";
  import Input from "$components/Input.svelte";
  import { showToast } from "$lib/utils/ToastAlert.js";

  export let data;

  let form;

  const eyeIcon = "heroicons:eye";
  const eyeOffIcon = "heroicons:eye-slash";
  let showOldPassword = false;
  let showNewPassword = false;

  let profile = {
    id: data?.user?.id || "",
    name: data?.user?.name || "",
    email: data?.user?.email || "",
    role: data?.user?.role || "",
  };

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
  ];
</script>

<section class="text-gray-800 space-y-10">
  <div class="border-b border-gray-300 pb-4">
    <h2 class="text-2xl font-bold tracking-tight">Kelola Profil Saya</h2>
    <p class="text-sm text-gray-500 mt-1">
      Halaman ini berfungsi untuk mengatur dan memperbarui informasi pribadi
      Anda yang digunakan di dalam sistem. Dari sini Anda dapat mengubah data
      profil seperti nama dan email, serta memastikan akun Anda tetap aman
      dengan cara mengganti kata sandi secara berkala. Jagalah informasi ini
      agar selalu akurat dan rahasia, sehingga pengalaman penggunaan sistem
      menjadi lebih optimal.
    </p>
  </div>

  <form
    method="POST"
    action="/pengaturan/api/profile"
    use:enhance={({ formData }) => {
      return async ({ update, result }) => {
        if (result?.toast)
          showToast(result.toast.message, result.toast.type, result.redirect);
        await update({ reset: true });
      };
    }}
    class="space-y-10"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
      <div class="space-y-2">
        <h3 class="text-lg font-semibold">Informasi Profil</h3>
        <p class="text-sm text-gray-500">
          Lengkapi dan perbarui informasi dasar profil Anda. Data ini akan
          digunakan oleh sistem untuk keperluan identifikasi dan komunikasi,
          termasuk notifikasi maupun akses tertentu sesuai dengan peran yang
          dimiliki.
        </p>
      </div>

      <div class="space-y-6">
        <Input
          name="name"
          type="text"
          bind:value={profile.name}
          label="Nama"
          placeholder="Masukkan nama lengkap Anda"
          required
        />
        <Input
          type="email"
          name="email"
          bind:value={profile.email}
          label="Email"
          placeholder="Alamat email untuk login"
          required
        />
        <Input
          type="text"
          name="role"
          label="Role"
          bind:value={profile.role}
          placeholder="Peran dalam sistem"
          disabled
        />
      </div>
    </div>

    <div class="flex justify-end">
      <Button type="submit" variant="emerald" rounded="lg" size="sm">
        Simpan Perubahan Profil
      </Button>
    </div>
  </form>

  <form
    method="POST"
    action="/pengaturan/api/chang-password"
    use:enhance={({ formData }) => {
      return async ({ update, result }) => {
        if (result?.toast)
          showToast(result.toast.message, result.toast.type, result.redirect);
        await update({ reset: true });
      };
    }}
    class="border-t border-gray-200 pt-8 space-y-4"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
      <div class="space-y-2">
        <h3 class="text-lg font-semibold">Keamanan Akun</h3>
        <p class="text-sm text-gray-500">
          Untuk menjaga keamanan akun, Anda dapat mengubah kata sandi secara
          rutin. Gunakan kata sandi yang kuat dan sulit ditebak, hindari
          penggunaan ulang dari akun lain, serta simpan di tempat yang aman.
          Fitur ini akan membantu melindungi data pribadi Anda dari akses yang
          tidak sah.
        </p>
      </div>

      <div class="space-y-6">
        <Input
          name="old_password"
          label="Password Lama"
          placeholder="Masukkan kata sandi lama Anda"
          type={showOldPassword ? "text" : "password"}
          suffixIcon={showOldPassword ? eyeOffIcon : eyeIcon}
          on:suffixClick={() => (showOldPassword = !showOldPassword)}
          required
        />
        <Input
          name="new_password"
          label="Password Baru"
          placeholder="Masukkan kata sandi baru"
          type={showNewPassword ? "text" : "password"}
          suffixIcon={showNewPassword ? eyeOffIcon : eyeIcon}
          on:suffixClick={() => (showNewPassword = !showNewPassword)}
          required
        />
      </div>
    </div>

    <div class="flex justify-end">
      <Button type="submit" variant="emerald" rounded="lg" size="sm">
        Ubah Kata Sandi
      </Button>
    </div>
  </form>
</section>
