import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { fail, redirect } from '@sveltejs/kit';
import { kasusCache } from '$lib/cache/kasus.js';

export const actions = {
  delete: async ({ request, fetch, cookies }) => {
    const formData = await request.formData();
    const payload = Object.fromEntries(formData);

    if (!payload.id) {
      return fail(400, {
        toast: { type: 'error', message: 'ID kasus tidak ditemukan' }
      });
    }

    try {
      const response = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/kasus/${payload.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${cookies.get('session_token')}` }
      });

      const responseData = await response.json();

      if (!response.ok || responseData.status !== 'success') {
        return fail(400, {
          toast: { type: 'error', message: json.message || 'Gagal menghapus kasus' }
        });
      }

      Object.keys(kasusCache.pages)
        .filter(k => k.startsWith('kasus:page:'))
        .forEach((key) => {
          const pageData = kasusCache.get(key);
          if (!pageData?.kasus?.data) return;

          const newData = pageData.kasus.data.filter(p => p.ID != payload.id);

          if (newData.length !== pageData.kasus.data.length) {
            kasusCache.set(key, { ...pageData, kasus: { ...pageData.kasus, data: newData } });
          }
        });

      return {
        success: true,
        toast: { type: 'success', message: 'Data kasus berhasil dihapus' },
      };

    } catch (err) {
      return fail(500, {
        toast: {
          type: 'error',
          message: err.message || 'Terjadi kesalahan saat menghapus data'
        }
      });
    }
  }
};