import { fail, redirect } from '@sveltejs/kit';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { kunjunganCache } from '$lib/cache/kunjungan.js';

export const actions = {
  delete: async ({ request, fetch, cookies }) => {
    const formData = await request.formData();
    const id = formData.get('id');

    if (!id) {
      return fail(400, {
        toast: { type: 'error', message: 'ID kunjungan tidak ditemukan' }
      });
    }

    try {
      const response = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/kunjungan/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${cookies.get('session_token')}` }
      });

      const json = await response.json();

      if (!response.ok || json.status !== 'success') {
        return fail(400, {
          toast: { type: 'error', message: json.message || 'Gagal menghapus kunjungan' }
        });
      }

      kunjunganCache.clear();

      return {
        success: true,
        toast: { type: 'success', message: 'Kunjungan berhasil dihapus' },
      };
    } catch (error) {
      return fail(500, {
        toast: {
          type: 'error',
          message: error.message || 'Terjadi kesalahan server saat menghapus'
        }
      });
    }
  }
};
