import { fail, redirect } from '@sveltejs/kit';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { pasienCache } from '$lib/cache/pasien.js';

export const actions = {
  import: async ({ request, fetch, cookies }) => {
    const formData = await request.formData();
    const files = formData.getAll("File");

    if (!files.length) {
      return fail(400, {
        toast: { type: "error", message: "Tidak ada file yang dipilih" }
      });
    }

    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return fail(400, {
          toast: {
            type: "error",
            message: `File ${file.name} bukan format Excel (.xls/.xlsx)`
          }
        });
      }
    }

    try {
      const response = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/pasien/import`, {
        method: "POST",
        headers: { Authorization: `Bearer ${cookies.get("session_token")}` },
        body: formData
      });

      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        return fail(400, {
          toast: { type: "error", message: result.message || "Import gagal" }
        });
      }

      pasienCache.clear();

      return {
        success: true,
        toast: { type: "success", message: "File Excel berhasil diimport" },
        redirect: '/pasien'
      };
    } catch (error) {
      return fail(500, {
        toast: { type: "error", message: error.message || "Terjadi kesalahan server" }
      });
    }
  },

  delete: async ({ request, fetch, cookies }) => {
    const formData = await request.formData();
    const payload = Object.fromEntries(formData);

    if (!payload.id) {
      return fail(400, {
        toast: { type: 'error', message: 'ID pasien tidak ditemukan' }
      });
    }

    try {
      const response = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/pasien/${payload.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${cookies.get('session_token')}` }
      });

      const json = await response.json();

      if (!response.ok || json.status !== 'success') {
        return fail(400, {
          toast: { type: 'error', message: json.message || 'Gagal menghapus pasien' }
        });
      }

      Object.keys(pasienCache.pages)
        .filter(k => k.startsWith('pasien:page:'))
        .forEach((key) => {
          const pageData = pasienCache.get(key);
          if (!pageData?.pasien?.data) return;

          const newData = pageData.pasien.data.filter(p => p.ID != payload.id);

          if (newData.length !== pageData.pasien.data.length) {
            pasienCache.set(key, { ...pageData, pasien: { ...pageData.pasien, data: newData } });
          }
        });

      return {
        success: true,
        toast: { type: 'success', message: 'Pasien berhasil dihapus' },
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