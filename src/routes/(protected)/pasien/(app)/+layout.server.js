import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { pasienCache } from '$lib/cache/pasien.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, cookies, url }) => {
  const page = Number(url.searchParams.get('page') || 1);
  const per_page = Number(url.searchParams.get('per_page') || 10);

  const filters = {
    NoRM: url.searchParams.get('NoRM') || '',
    NIK: url.searchParams.get('NIK') || '',
    NamaPasien: url.searchParams.get('NamaPasien') || '',
  };

  const columns = [
    { label: 'Nomor RM', key: 'NoRM' },
    { label: 'Nama Pasien', key: 'NamaPasien' },
    { label: 'Jenis Kelamin', key: 'JenisKelamin' },
    { label: 'Alamat', key: 'Alamat' },
  ];

  const emptyResult = (toastMessage) => ({
    pasien: { data: [], total: 0, page, per_page, total_pages: 0 },
    statistik: { total: 0, total_aktif: 0, total_tidak_aktif: 0 },
    columns,
    filters,
    toast: toastMessage ? { type: 'error', message: toastMessage } : null,
  });

  const cacheKey = filters.NoRM || filters.NIK || filters.NamaPasien
    ? `pasien:search:${filters.NoRM}:${filters.NIK}:${filters.NamaPasien}`
    : `pasien:page:${page}:${per_page}`;

  const cached = pasienCache.get(cacheKey);
  if (cached) return { ...cached, cached: true };

  try {
    const urlApi = filters.NoRM || filters.NIK || filters.NamaPasien
      ? `${PUBLIC_API_BASE_URL}/api/v2/pasien/search?NoRM=${filters.NoRM}&NIK=${filters.NIK}&NamaPasien=${filters.NamaPasien}`
      : `${PUBLIC_API_BASE_URL}/api/v2/pasien?page=${page}&per_page=${per_page}`;

    const res = await fetch(urlApi, {
      headers: { Authorization: `Bearer ${cookies.get('session_token')}` },
    });

    if (!res.ok) throw new Error(`API error ${res.status}`);

    const { status, message, data: responseData } = await res.json();
    if (status !== 'success' || !responseData) {
      return emptyResult(message || 'Data pasien tidak ditemukan');
    }

    const pasienData = responseData.data || responseData || [];
    const result = {
      pasien: {
        data: pasienData,
        total: responseData.total || pasienData.length,
        page: responseData.page || page,
        per_page: responseData.per_page || per_page,
        total_pages:
          responseData.total_pages ||
          Math.ceil((responseData.total || pasienData.length) / (responseData.per_page || per_page)),
      },
      statistik: responseData.statistik || { total: 0, total_aktif: 0, total_tidak_aktif: 0 },
      columns,
      filters,
      toast: pasienData.length === 0 ? { type: 'error', message: 'Data pasien kosong' } : null,
    };

    pasienCache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.error('Fetch gagal:', err.message);
    return cached
      ? { ...cached, cached: true, toast: { type: 'error', message: 'Gagal ambil data terbaru, gunakan data cache' } }
      : emptyResult('Tidak ada data pasien tersedia');
  }
};
