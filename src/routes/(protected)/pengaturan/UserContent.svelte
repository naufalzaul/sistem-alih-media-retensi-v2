<script>
  import { enhance } from "$app/forms";
  import Button from "$components/Button.svelte";
  import Input from "$components/Input.svelte";
  import Table from "$lib/components/Table.svelte";
  import Icon from "@iconify/svelte";
  import Pagination from "$components/Pagination.svelte";
  import UserModal from "$lib/components/UserModal.svelte";
  import SearchableSelect from "$components/SearchableSelect.svelte";
  import { showToast } from "$lib/utils/ToastAlert.js";

  export let data;
  export let form;

  let currentPage = 1;
  const perPage = 10;
  const eyeIcon = "heroicons:eye";
  const eyeOffIcon = "heroicons:eye-slash";

  let showDetailModal = false;
  let showPasswordModal = false;

  let selectedUser = null;

  let showOldPassword = false;
  let showNewPassword = false;

  $: totalData = data?.users?.total || 0;

  function handlePageChange(page) {
    const params = new URLSearchParams({ page, per_page: perPage });
  }

  function handleAction({ type, detail }) {
    if (type === "edit") {
      selectedUser = detail;
      showDetailModal = true;
    } else if (type === "change") {
      selectedUser = detail;
      showPasswordModal = true;
    }
  }

  $: errors = form?.errors || {};
  $: values = form?.values || {
    old_password: "",
    new_password: "",
  };
</script>

<section class="text-gray-800 space-y-10">
  <div class="border-b border-gray-300 pb-4">
    <h2 class="text-2xl font-bold tracking-tight">Kelola Pengguna</h2>
    <p class="text-sm text-gray-500 mt-1">
      Halaman ini digunakan untuk mengelola seluruh akun pengguna dan
      administrator yang memiliki akses ke dalam sistem. Anda dapat menambahkan
      admin baru, memperbarui informasi pengguna yang sudah ada, mengubah kata
      sandi, hingga menonaktifkan akun jika diperlukan.
    </p>
  </div>

  <form method="POST" action="?/createUser" use:enhance class="space-y-10">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
      <div class="space-y-2">
        <h3 class="text-lg font-semibold">Tambah Pengguna Baru</h3>
        <p class="text-sm text-gray-500">
          Lengkapi form berikut untuk menambahkan akun pengguna baru yang dapat
          mengakses sistem.
        </p>
      </div>

      <div class="space-y-6">
        <Input
          name="name"
          label="Nama"
          placeholder="Masukkan nama lengkap"
          required
        />
        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="Email yang digunakan untuk login"
          required
        />
        <Input
          type="text"
          name="role"
          label="Role"
          placeholder="Contoh: Admin atau Super Admin"
          required
        />
      </div>
    </div>

    <div class="flex justify-end">
      <Button type="submit" variant="emerald" rounded="lg" size="sm">
        Tambahkan Admin
      </Button>
    </div>
  </form>

  <div class="border-t border-gray-200 pt-8 space-y-4">
    <div class="space-y-2">
      <h2 class="text-xl font-semibold">Daftar Pengguna</h2>
      <p class="text-sm text-gray-500">
        Berikut adalah daftar seluruh akun pengguna yang telah terdaftar dalam
        sistem. Anda dapat melakukan pembaruan data, mengatur ulang kata sandi,
        atau menghapus akun pengguna apabila sudah tidak diperlukan.
      </p>
    </div>

    <div class="overflow-x-auto mt-4">
      <Table
        columns={data.users?.columns}
        data={data?.users?.data || data?.users}
        showAction={true}
        showStatus={true}
        actions={[
          {
            name: "edit",
            label: "Perbarui Data",
            color: "text-gray-600 hover:bg-gray-50",
          },
          {
            name: "change",
            label: "Ubah Kata Sandi",
            color: "text-gray-600 hover:bg-gray-50",
          },
          {
            name: "delete",
            label: "Hapus Akun",
            color: "text-red-600 hover:bg-red-50",
          },
        ]}
        on:edit={handleAction}
        on:change={handleAction}
        on:delete={handleAction}
      >
        <svelte:fragment slot="pagination"></svelte:fragment>
      </Table>
    </div>
  </div>
</section>

{#if selectedUser}
  <UserModal
    bind:open={showDetailModal}
    onClose={() => (showDetailModal = false)}
  >
    <section slot="informasi-pengguna" class="space-y-3">
      <h3
        class="text-sm font-semibold text-gray-600 uppercase flex items-center"
      >
        <Icon icon="heroicons:user-circle-20-solid" class="mr-2 w-4 h-4" />
        Informasi User
      </h3>

      <form
        method="POST"
        action="/pengaturan/api/user/update"
        use:enhance={({ formData }) => {
          return async ({ update, result }) => {
            if (result?.toast)
              showToast(
                result.toast.message,
                result.toast.type,
                result.redirect
              );
            await update({ reset: true });
          };
        }}
        class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
      >
        <input type="hidden" name="id" value={selectedUser.id} />

        <Input
          name="name"
          label="Nama"
          placeholder="Masukkan nama"
          bind:value={selectedUser.name}
          error={errors.nama?.[0]}
          required
        />

        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="Masukkan email"
          bind:value={selectedUser.email}
          error={errors.email?.[0]}
          required
        />

        <SearchableSelect
          name="role"
          label="Role"
          selected={selectedUser.role}
          options={["Admin", "User"]}
          placeholder="Pilih role"
          error={errors.role?.[0]}
          required
        />

        <SearchableSelect
          name="status"
          label="Status"
          selected={selectedUser.status}
          options={["Aktif", "Tidak Aktif"]}
          placeholder="Pilih status"
          error={errors.status?.[0]}
          required
        />

        <div class="md:col-span-full flex justify-end gap-3 pt-4">
          <Button type="submit" size="sm" variant="emerald">
            Perbarui Data
          </Button>
        </div>
      </form>
    </section>
  </UserModal>
{/if}

{#if selectedUser}
  <UserModal
    bind:open={showPasswordModal}
    onClose={() => (showPasswordModal = false)}
  >
    <section slot="ubah-password" class="space-y-3">
      <h3
        class="text-sm font-semibold text-gray-600 uppercase flex items-center"
      >
        <Icon icon="heroicons:key-20-solid" class="mr-2 w-4 h-4" />
        Ubah Password
      </h3>

      <form
        method="POST"
        action="/pengaturan/api/user/change-password"
        use:enhance={({ formData }) => {
          return async ({ update, result }) => {
            if (result?.toast) {
              showToast(
                result.toast.message,
                result.toast.type,
                result.redirect
              );
            }
            await update({ reset: true });
          };
        }}
        class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
      >
        <input type="hidden" name="id" value={selectedUser.id} />

        <Input
          name="old_password"
          label="Password Lama"
          placeholder="Masukkan password"
          type={showOldPassword ? "text" : "password"}
          suffixIcon={showOldPassword ? eyeOffIcon : eyeIcon}
          on:suffixClick={() => (showOldPassword = !showOldPassword)}
          error={errors.old_password?.[0]}
          bind:value={values.old_password}
          required
        />
        <Input
          name="new_password"
          label="Password Baru"
          placeholder="Masukkan password"
          type={showNewPassword ? "text" : "password"}
          suffixIcon={showNewPassword ? eyeOffIcon : eyeIcon}
          on:suffixClick={() => (showNewPassword = !showNewPassword)}
          error={errors.new_password?.[0]}
          bind:value={values.new_password}
          required
        />

        <div class="md:col-span-full flex justify-end gap-3 pt-4">
          <Button type="submit" size="sm" variant="emerald">
            Simpan Password
          </Button>
        </div>
      </form>
    </section>
  </UserModal>
{/if}
