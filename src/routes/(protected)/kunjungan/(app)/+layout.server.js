import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { kunjunganCache } from '$lib/cache/kunjungan.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, cookies, url }) => {
  const page = Number(url.searchParams.get('page') || 1);
  const per_page = Number(url.searchParams.get('per_page') || 10);

  const filters = {
    NoRM: url.searchParams.get('NoRM') || '',
    NamaPasien: url.searchParams.get('NamaPasien') || '',
    JenisKasus: url.searchParams.get('JenisKasus') || '',
  };

  const columns = [
    { label: 'Nomor RM', key: 'NoRM' },
    { label: 'Nama Pasien', key: 'NamaPasien' },
    { label: 'Jenis Kasus', key: 'JenisKasus' },
    { label: 'Alamat', key: 'Alamat' },
  ];

  const emptyResult = (toastMessage) => ({
    kunjungan: { data: [], total: 0, page, per_page, total_pages: 0 },
    statistik: { total: 0 },
    columns,
    filters,
    toast: toastMessage ? { type: 'error', message: toastMessage } : null,
  });

  const cacheKey =
    filters.NoRM || filters.NamaPasien || filters.JenisKasus
      ? `kunjungan:search:${filters.NoRM}:${filters.NamaPasien}:${filters.JenisKasus}`
      : `kunjungan:page:${page}:${per_page}`;

  const cached = kunjunganCache.get(cacheKey);
  if (cached) return { ...cached, cached: true };

  try {
    const urlApi =
      filters.NoRM || filters.NamaPasien || filters.JenisKasus
        ? `${PUBLIC_API_BASE_URL}/api/v2/kunjungan/search?NoRM=${filters.NoRM}&NamaPasien=${filters.NamaPasien}&JenisKasus=${filters.JenisKasus}`
        : `${PUBLIC_API_BASE_URL}/api/v2/kunjungan?page=${page}&per_page=${per_page}`;

    const res = await fetch(urlApi, {
      headers: { Authorization: `Bearer ${cookies.get('session_token')}` },
    });

    if (!res.ok) throw new Error(`API error ${res.status}`);

    const { status, message, data: responseData } = await res.json();
    if (status !== 'success' || !responseData) {
      return emptyResult(message || 'Data kunjungan tidak ditemukan');
    }

    const kunjunganData = responseData.data || responseData || [];
    const result = {
      kunjungan: {
        data: kunjunganData,
        total: responseData.total || kunjunganData.length,
        page: responseData.page || page,
        per_page: responseData.per_page || per_page,
        total_pages:
          responseData.total_pages ||
          Math.ceil(
            (responseData.total || kunjunganData.length) /
            (responseData.per_page || per_page)
          ),
      },
      statistik: responseData.statistik || { total: 0 },
      columns,
      filters,
      toast:
        kunjunganData.length === 0
          ? { type: 'error', message: 'Data kunjungan kosong' }
          : null,
    };

    kunjunganCache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.error('Fetch kunjungan gagal:', err.message);
    return cached
      ? {
        ...cached,
        cached: true,
        toast: {
          type: 'error',
          message: 'Gagal ambil data terbaru, gunakan data cache',
        },
      }
      : emptyResult('Tidak ada data kunjungan tersedia');
  }
};
