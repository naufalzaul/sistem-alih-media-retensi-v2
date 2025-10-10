import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { berandaCache } from '$lib/cache/beranda.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, cookies }) => {

  const token = cookies.get('session_token');
  const cacheKey = 'beranda:statistik';

  const emptyResult = (toastMessage) => ({
    message: toastMessage || 'Tidak ada data statistik',
    statistik: { total: 0, total_aktif: 0, total_tidak_aktif: 0 },
    tahun: new Date().getFullYear(),
    toast: toastMessage ? { type: 'error', message: toastMessage } : null,
  });

  const cached = berandaCache.get(cacheKey);
  if (cached) return { ...cached, cached: true };

  try {
    const res = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/general/statistik`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error(`API error ${res.status}`);

    const { status, message, data } = await res.json();
    if (status !== 'success' || !data) {
      return emptyResult(message || 'Statistik tidak berhasil diambil');
    }

    const result = {
      message,
      statistik: data,
      tahun: new Date().getFullYear(),
    };

    berandaCache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.error('Fetch statistik gagal:', err.message);

    return cached
      ? { ...cached, cached: true, toast: { type: 'error', message: 'Gagal ambil statistik terbaru, gunakan data cache' } }
      : emptyResult('Tidak ada data statistik tersedia');
  }
};
``