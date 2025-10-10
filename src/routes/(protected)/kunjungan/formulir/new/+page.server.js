import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { kunjunganCache } from '$lib/cache/kunjungan.js';

const reportSchema = z.object({
  NoRM: z.string().min(1, "Nomor RM harus diisi"),
  NamaPasien: z.string().min(1, "Nama pasien harus diisi"),
  NIK: z.string().min(1, "NIK harus diisi"),
  Alamat: z.string().min(1, "Alamat harus diisi"),
  TglMasuk: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid"),
  JenisKunjungan: z.string().min(1, "Jenis kunjungan harus diisi"),
  JenisKasus: z.string().min(1, "Jenis kasus harus diisi"),
  File: z
    .array(z.instanceof(File))
    .optional()

});

export function load({ cookies }) {
  let localData = null;

  try {
    localData = JSON.parse(cookies.get("localData") || "{}");
  } catch {
    localData = {};
  }

  const pasien = localData?.pasien || null;
  const kasus = localData?.kasus || null;
  const dataTemp = localData?.dataTemp || null;

  return {
    formOptions: {
      JenisKunjungan: ["RI", "RJ"],
    },
    defaultValues: {
      ID: pasien?.ID || dataTemp?.ID || "",
      NoRM: pasien?.NoRM || dataTemp?.NoRM || "",
      NamaPasien: pasien?.NamaPasien || dataTemp?.NamaPasien || "",
      NIK: pasien?.NIK || dataTemp?.NIK || "",
      Alamat: pasien?.Alamat || dataTemp?.Alamat || "",
      TglMasuk: dataTemp?.TglMasuk || "",
      JenisKasus: kasus?.JenisKasus || dataTemp?.JenisKasus || "",
      File: []
    }
  };
}


export const actions = {
  searchPasien: async ({ request, fetch, cookies }) => {
    const formData = await request.formData();
    const NoRM = formData.get('NoRM') || '';

    try {
      const response = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/pasien/search?NoRM=${encodeURIComponent(NoRM)}`, {
        headers: { Authorization: `Bearer ${cookies.get('session_token') || ''}` }
      });

      const json = await response.json();

      if (!response.ok || json.status !== 'success') {
        return fail(response.status || 400, {
          toast: { type: 'error', message: json.message || 'Gagal mencari pasien' }
        });
      }

      const pasien = json.data?.[0] || null;

      if (!pasien) {
        return fail(404, { toast: { type: 'error', message: 'Pasien tidak ditemukan' } });
      }

      let localData = {};
      try {
        localData = JSON.parse(cookies.get('localData') || '{}');
      } catch {
        localData = {};
      }

      localData.pasien = pasien;

      cookies.set('localData', JSON.stringify(localData), {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60
      });
      return {
        success: true,
        toast: { type: 'success', message: 'Pasien berhasil ditemukan' },
      };

    } catch (err) {
      if (err.status) throw err;
      return fail(500, {
        toast: { type: 'error', message: err.message || 'Server error saat mencari pasien' }
      });
    }
  },

  searchKasus: async ({ request, fetch, cookies }) => {
    const formData = await request.formData();
    const JenisKasus = formData.get('JenisKasus') || '';

    try {
      const response = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/kasus/search?JenisKasus=${encodeURIComponent(JenisKasus)}`, {
        headers: { Authorization: `Bearer ${cookies.get('session_token') || ''}` }
      });

      const json = await response.json();

      if (!response.ok || json.status !== 'success') {
        return fail(response.status || 400, {
          toast: { type: 'error', message: json.message || 'Gagal mencari kasus' }
        });
      }

      const kasus = json.data?.[0] || null;

      if (!kasus) {
        return fail(404, { toast: { type: 'error', message: 'Kasus tidak ditemukan' } });
      }

      let localData = {};
      try {
        localData = JSON.parse(cookies.get('localData') || '{}');
      } catch {
        localData = {};
      }

      localData.kasus = kasus;

      cookies.set('localData', JSON.stringify(localData), {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60
      });

      return {
        success: true,
        toast: { type: 'success', message: 'Kasus berhasil ditemukan' },
      };
    } catch (err) {
      if (err.status) throw err;
      return fail(500, {
        toast: { type: 'error', message: err.message || 'Server error saat mencari kasus' }
      });
    }
  },
  addKunjungan: async ({ request, fetch, cookies }) => {
    const formData = await request.formData();

    let localData = {};
    try {
      localData = JSON.parse(cookies.get('localData') || '{}');
    } catch { }

    const pasien = localData?.pasien;
    const kasus = localData?.kasus;

    if (!pasien?.ID || !kasus?.ID) {
      return fail(400, {
        toast: { type: 'error', message: 'Pasien atau kasus belum dipilih' }
      });
    }

    const payload = new FormData();
    payload.append('IdPasien', pasien.ID);
    payload.append('IdKasus', kasus.ID);
    payload.append('TglMasuk', formData.get('TglMasuk'));
    payload.append('JenisKunjungan', formData.get('JenisKunjungan'));

    const files = formData.getAll('File');
    files.forEach((file, index) => {
      if (file instanceof File && file.size > 0) {
        payload.append(`File`, file);
      }
    });

    try {
      const response = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/kunjungan`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cookies.get('session_token') || ''}`
        },
        body: payload
      });

      const responseData = await response.json();

      if (!response.ok || responseData.status !== 'success') {
        return fail(response.status || 400, {
          toast: { type: 'error', message: responseData.message || 'Gagal menambah kunjungan' }
        });
      }

      cookies.delete('localData', { path: '/' });

      Object.keys(kunjunganCache.pages)
        .filter(key => key.startsWith('kunjungan:page:1:'))
        .forEach(key => {
          const pageData = kunjunganCache.get(key);
          if (!pageData?.kunjungan?.data) return;

          const kunjunganBaru = responseData.data;
          pageData.kunjungan.data.unshift(kunjunganBaru);

          if (pageData.kunjungan.data.length > pageData.kunjungan.per_page) {
            pageData.kunjungan.data.splice(pageData.kunjungan.per_page);
          }

          pageData.kunjungan.total += 1;
          pageData.kunjungan.total_pages = Math.ceil(pageData.kunjungan.total / pageData.kunjungan.per_page);

          kunjunganCache.set(key, pageData);
        });

      return {
        success: true,
        toast: { type: 'success', message: 'Kunjungan berhasil ditambahkan' },
        redirect: '/kunjungan'
      };
    } catch (err) {
      return fail(500, {
        toast: { type: 'error', message: err.message || 'Server error saat tambah kunjungan' }
      });
    }
  },
};
