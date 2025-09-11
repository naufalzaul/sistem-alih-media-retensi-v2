export async function load() {

  const laporanData = [
    {
      nomor_rm: "RM-20230701",
      nama_pasien: "Siti Aminah",
      kasus: "Penyakit Dalam",
      transaksi: "Alih Media",
      Status: "Aktif"
    },
    {
      nomor_rm: "RM-20230702",
      nama_pasien: "Budi Santoso",
      kasus: "Bedah Umum",
      transaksi: "Alih Media",
      Status: "Tidak Aktif"
    },
    {
      nomor_rm: "RM-20230703",
      nama_pasien: "Nur Hidayah",
      kasus: "Anak",
      transaksi: "Retensi",
      Status: "Tidak Aktif"
    },
    {
      nomor_rm: "RM-20230704",
      nama_pasien: "Agus Salim",
      kasus: "Penyakit Dalam",
      transaksi: "Retensi",
      Status: "Aktif"
    },
    {
      nomor_rm: "RM-20230705",
      nama_pasien: "Linda Maulida",
      kasus: "Kebidanan",
      transaksi: "Pemusnahan",
      Status: "Aktif"
    },
    {
      nomor_rm: "RM-20230706",
      nama_pasien: "Dedi Mulyadi",
      kasus: "Paru",
      transaksi: "Pemusnahan",
      Status: "Tidak Aktif"
    },
    {
      nomor_rm: "RM-20230707",
      nama_pasien: "Rina Kartika",
      kasus: "Anak",
      transaksi: "Alih Media",
      Status: "Tidak Aktif"
    },
    {
      nomor_rm: "RM-20230708",
      nama_pasien: "Andi Wijaya",
      kasus: "Psikiatri",
      transaksi: "Retensi",
      Status: "Tidak Aktif"
    },
    {
      nomor_rm: "RM-20230709",
      nama_pasien: "Mega Pertiwi",
      kasus: "Mata",
      transaksi: "Alih Media",
      Status: "Aktif"
    },
    {
      nomor_rm: "RM-20230710",
      nama_pasien: "Yusuf Hamzah",
      kasus: "Jiwa",
      transaksi: "Retensi",
      Status: "Aktif"
    },
    {
      nomor_rm: "RM-20230711",
      nama_pasien: "Rahmawati",
      kasus: "Gigi dan Mulut",
      transaksi: "Alih Media",
      Status: "Tidak Aktif"
    },
    {
      nomor_rm: "RM-20230712",
      nama_pasien: "Fajar Hidayat",
      kasus: "Orthopedi",
      transaksi: "Pemusnahan",
      Status: "Tidak Aktif"
    },
    {
      nomor_rm: "RM-20230713",
      nama_pasien: "Tania Nurhaliza",
      kasus: "Neurologi",
      transaksi: "Pemusnahan",
      Status: "Tidak Aktif"
    },
    {
      nomor_rm: "RM-20230714",
      nama_pasien: "Heri Gunawan",
      kasus: "Penyakit Dalam",
      transaksi: "Retensi",
      Status: "Aktif"
    },
    {
      nomor_rm: "RM-20230715",
      nama_pasien: "Dina Mariana",
      kasus: "Kardiologi",
      transaksi: "Alih Media",
      Status: "Aktif"
    },
    {
      nomor_rm: "RM-20230716",
      nama_pasien: "Riko Saputra",
      kasus: "Bedah Umum",
      transaksi: "Alih Media",
      Status: "Tidak Aktif"
    },
    {
      nomor_rm: "RM-20230717",
      nama_pasien: "Sulastri",
      kasus: "Kesehatan Jiwa",
      transaksi: "Pemusnahan",
      Status: "Aktif"
    },
    {
      nomor_rm: "RM-20230718",
      nama_pasien: "Irwan Setiawan",
      kasus: "Paru",
      transaksi: "Pemusnahan",
      Status: "Tidak Aktif"
    },
    {
      nomor_rm: "RM-20230719",
      nama_pasien: "Lestari Dewi",
      kasus: "Anak",
      transaksi: "Retensi",
      Status: "Tidak Aktif"
    },
    {
      nomor_rm: "RM-20230720",
      nama_pasien: "Yudi Hartono",
      kasus: "Jantung",
      transaksi: "Retensi",
      Status: "Tidak Aktif"
    },
  ];

  const selectByTransaction = [...new Set(laporanData.map(d => d.transaksi))];
  const selectByCategory = [...new Set(laporanData.map(d => d.kasus))];

  return {
    laporanData,
    laporanColumns: [
      { key: "nomor_rm", label: "No RM" },
      { key: "nama_pasien", label: "Nama Pasien" },
      { key: "transaksi", label: "Transaksi" },
      { key: "kasus", label: "Kasus" }
    ],
    selectByTransaction,
    selectByCategory
  };
}
