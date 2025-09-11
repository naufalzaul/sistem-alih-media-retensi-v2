import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { pemusnahanCache } from '$lib/cache/pemusnahan.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, cookies, url }) => {
  const page = Number(url.searchParams.get('page') || 1);
  const per_page = Number(url.searchParams.get('per_page') || 10);

  const filters = {
    NoRM: url.searchParams.get('NoRM') || '',
    NamaPasien: url.searchParams.get('NamaPasien') || '',
  };

  const columns = [
    { label: 'Nomor RM', key: 'NoRM' },
    { label: 'Nama Pasien', key: 'NamaPasien' },
    { label: 'Tanggal Laporan', key: 'TglLaporan' },
  ];

  const emptyResult = (toastMessage) => ({
    pemusnahan: { data: [], total: 0, page, per_page, total_pages: 0 },
    statistik: { total_dokumen: 0, total_sudah: 0, total_belum: 0 },
    columns,
    filters,
    toast: toastMessage ? { type: 'error', message: toastMessage } : null,
  });

  const cacheKey =
    filters.NoRM || filters.NamaPasien
      ? `pemusnahan:search:${filters.NoRM}:${filters.NamaPasien}`
      : `pemusnahan:page:${page}:${per_page}`;

  const cached = pemusnahanCache.get(cacheKey);
  if (cached) return { ...cached, cached: true };

  try {
    const urlApi =
      filters.NoRM || filters.NamaPasien
        ? `${PUBLIC_API_BASE_URL}/api/v2/pemusnahan/search?NoRM=${filters.NoRM}&NamaPasien=${filters.NamaPasien}`
        : `${PUBLIC_API_BASE_URL}/api/v2/pemusnahan?page=${page}&per_page=${per_page}`;

    const res = await fetch(urlApi, {
      headers: { Authorization: `Bearer ${cookies.get('session_token')}` },
    });

    if (!res.ok) throw new Error(`API error ${res.status}`);

    const { status, message, data: responseData } = await res.json();
    if (status !== 'success' || !responseData) {
      return emptyResult(message || 'Data pemusnahan tidak ditemukan');
    }

    const pemusnahanData = responseData.data || responseData || [];
    const result = {
      pemusnahan: {
        data: pemusnahanData,
        total: responseData.total || pemusnahanData.length,
        page: responseData.page || page,
        per_page: responseData.per_page || per_page,
        total_pages:
          responseData.total_pages ||
          Math.ceil(
            (responseData.total || pemusnahanData.length) /
            (responseData.per_page || per_page)
          ),
      },
      statistik:
        responseData.statistik || {
          total_dokumen: 0,
          total_sudah: 0,
          total_belum: 0,
        },
      columns,
      filters,
      toast:
        pemusnahanData.length === 0
          ? { type: 'error', message: 'Data pemusnahan kosong' }
          : null,
    };

    pemusnahanCache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.error('Fetch pemusnahan gagal:', err.message);
    return cached
      ? {
        ...cached,
        cached: true,
        toast: {
          type: 'error',
          message: 'Gagal ambil data terbaru, gunakan data cache',
        },
      }
      : emptyResult('Tidak ada data pemusnahan tersedia');
  }
};
