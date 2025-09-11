export const sidebarRoute = [
  {
    label: "Beranda",
    icon: "mdi:view-dashboard-outline",
    href: "/beranda",
    roles: ["user", "admin"]
  },
  {
    label: "Pasien", icon: "mdi:file-document-outline", href: "/pasien",
    roles: ["user", "admin"]
  },
  { label: "Kasus", icon: "mdi:shape-outline", href: "/kasus", roles: ["user", "admin"] },
  {
    label: "Kunjungan", icon: "mdi:calendar-clock", href: "/kunjungan", roles: ["user", "admin"]
  },

  {
    label: "Transaksi",
    icon: "mdi:swap-horizontal",
    id: "transaksi",
    roles: ["user", "admin"],
    children: [
      {
        label: "Alih Media",
        href: "/transaksi/alihmedia",
        icon: "mdi:file-sync-outline",
      },
      {
        label: "Retensi",
        href: "/transaksi/retensi",
        icon: "mdi:archive-outline",
      },
      {
        label: "Pemusnahan",
        href: "/transaksi/pemusnahan",
        icon: "mdi:trash-can-outline",
      },
    ],
  },
  // {
  //   label: "Laporan", icon: "mdi:file-chart-outline", href: "/laporan",
  //   roles: ["user", "admin"]
  // },
  {
    label: "Pengaturan",
    icon: "mdi:account-cog-outline",
    href: "/pengaturan",
    roles: ["user", "admin"],
    bottom: true
  },
  // {
  //   label: "Riwayat", icon: "mdi:history", href: "/riwayat",
  //   roles: ["admin"], bottom: true
  // },
  { label: "Keluar", icon: "mdi:logout", href: "/logout", roles: ["user", "admin"], bottom: true },
];
