<script>
  import TabsPanel from "$components/TabsPanel.svelte";
  import ProfileContent from "./ProfileContent.svelte";
  import UserContent from "./UserContent.svelte";
  import SystemContent from "./SystemContent.svelte";
  import { showToast } from "$lib/utils/ToastAlert.js";

  export let data;
  export let form;

  const tabs = [
    {
      id: "profile",
      title: "Profil Saya",
      icon: "mdi:account-circle-outline",
      group: "Akun Saya",
      roles: ["admin", "user"],
      content: ProfileContent,
    },
    {
      id: "user",
      title: "Kelola Pengguna",
      icon: "mdi:account-multiple-outline",
      group: "Lainnya",
      roles: ["admin"],
      content: UserContent,
    },
    {
      id: "system",
      title: "Sistem",
      icon: "mdi:cog-outline",
      group: "Lainnya",
      roles: ["admin"],
      content: SystemContent,
    },
  ];

  $: errors = form?.errors || {};
  $: formError = form?.formError;

  $: if (form?.toast) {
    showToast(form.toast.message, form.toast.type, form.redirect);
  }
</script>

<section class="text-gray-800">
  <div class="mb-8">
    <h2 class="text-2xl font-semibold">Pengaturan Sistem</h2>
    <p class="text-sm text-gray-500 mb-4">
      Atur preferensi sistem, informasi instansi, dan komponen penting lainnya.
    </p>
  </div>

  <div class="relative">
    <TabsPanel {tabs} defaultTab="profile" userRole={data.user.role} {data} />
  </div>
</section>
