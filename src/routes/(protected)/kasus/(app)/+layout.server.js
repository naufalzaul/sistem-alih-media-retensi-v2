import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { kasusCache } from '$lib/cache/kasus.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, cookies, url }) => {
  const page = Number(url.searchParams.get('page') || 1);
  const per_page = Number(url.searchParams.get('per_page') || 10);

  const filters = {
    JenisKasus: url.searchParams.get('JenisKasus') || '',
  };

  const columns = [
    { label: 'Jenis Kasus', key: 'JenisKasus' },
    { label: 'Masa Aktif RI', key: 'MasaAktifRI' },
    { label: 'Masa Inaktif RI', key: 'MasaInaktifRI' },
    { label: 'Masa Aktif RJ', key: 'MasaAktifRJ' },
    { label: 'Masa Inaktif RJ', key: 'MasaInaktifRJ' },
  ];

  const emptyResult = (toastMessage) => ({
    kasus: { data: [], total: 0, page, per_page, total_pages: 0 },
    statistik: {
      rata_masa_aktif_ri: 0,
      rata_masa_inaktif_ri: 0,
      rata_masa_aktif_rj: 0,
      rata_masa_inaktif_rj: 0,
    },
    columns,
    filters,
    toast: toastMessage ? { type: 'error', message: toastMessage } : null,
  });

  const cacheKey = filters.JenisKasus
    ? `kasus:search:${filters.JenisKasus}`
    : `kasus:page:${page}:${per_page}`;

  const cached = kasusCache.get(cacheKey);
  if (cached) return { ...cached, cached: true };

  try {
    const urlApi = filters.JenisKasus
      ? `${PUBLIC_API_BASE_URL}/api/v2/kasus/search?JenisKasus=${filters.JenisKasus}`
      : `${PUBLIC_API_BASE_URL}/api/v2/kasus?page=${page}&per_page=${per_page}`;

    const res = await fetch(urlApi, {
      headers: { Authorization: `Bearer ${cookies.get('session_token')}` },
    });

    if (!res.ok) throw new Error(`API error ${res.status}`);

    const { status, message, data: responseData } = await res.json();
    if (status !== 'success' || !responseData) {
      return emptyResult(message || 'Data kasus tidak ditemukan');
    }

    const kasusData = responseData.data || responseData || [];
    const result = {
      kasus: {
        data: kasusData,
        total: responseData.total || kasusData.length,
        page: responseData.page || page,
        per_page: responseData.per_page || per_page,
        total_pages:
          responseData.total_pages ||
          Math.ceil((responseData.total || kasusData.length) / (responseData.per_page || per_page)),
      },
      statistik: responseData.statistik || {
        rata_masa_aktif_ri: 0,
        rata_masa_inaktif_ri: 0,
        rata_masa_aktif_rj: 0,
        rata_masa_inaktif_rj: 0,
      },
      columns,
      filters,
      toast: kasusData.length === 0 ? { type: 'error', message: 'Data kasus kosong' } : null,
    };

    kasusCache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.error('Fetch kasus gagal:', err.message);
    return cached
      ? { ...cached, cached: true, toast: { type: 'error', message: 'Gagal ambil data terbaru, gunakan data cache' } }
      : emptyResult('Tidak ada data kasus tersedia');
  }
};