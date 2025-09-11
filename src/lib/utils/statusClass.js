
export function getStatusClass(status) {
  switch (status) {
    case "Aktif":
    case "Sudah dialih media":
    case "Sudah diretensi":
    case "Sudah dimusnahkan":
      return "bg-emerald-100 text-emerald-700";
    case "Inaktif":
    case "Tidak Aktif":
    case "Belum dialih media":
    case "Belum diretensi":
    case "Belum dimusnahkan":
      return "bg-red-100 text-red-700";
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}