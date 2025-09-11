import { fail } from '@sveltejs/kit';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { pemusnahanCache } from '$lib/cache/pemusnahan.js';

export const actions = {
  delete: async ({ request, fetch, cookies }) => {
    const formData = await request.formData();
    const id = formData.get('id');

    if (!id) {
      return fail(400, {
        errors: { id: ['IdKunjungan wajib diisi'] },
        toast: { type: 'error', message: 'ID Pemusnahan tidak ditemukan' }
      });
    }

    try {
      const response = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/pemusnahan/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${cookies.get('session_token')}` }
      });

      const responseData = await response.json();

      if (!response.ok || responseData.status !== 'success') {
        return fail(400, {
          errors: {},
          toast: { type: 'error', message: responseData.message || 'Gagal menghapus data pemusnahan' }
        });
      }

      pemusnahanCache.clear();

      return {
        success: true,
        toast: { type: 'success', message: 'Data pemusnahan berhasil dihapus' }
      };
    } catch (err) {
      return fail(500, {
        errors: {},
        toast: {
          type: 'error',
          message: err.message || 'Terjadi kesalahan saat menghapus data pemusnahan'
        }
      });
    }
  }
};
