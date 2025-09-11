import { fail } from '@sveltejs/kit';
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
  File: z.any().optional()
});

export function load({ cookies }) {
  let localData = null;
  const raw = cookies.get("localData");

  if (raw) {
    try {
      localData = JSON.parse(raw);
    } catch {
      localData = null;
    }
  }

  return {
    formOptions: {
      JenisKunjungan: ["RI", "RJ"]
    },
    defaultValues: {
      ID: localData?.pasien?.ID || localData?.dataTemp?.ID || "",
      NoRM: localData?.pasien?.NoRM || localData?.dataTemp?.NoRM || "",
      NamaPasien: localData?.pasien?.NamaPasien || localData?.dataTemp?.NamaPasien || "",
      NIK: localData?.pasien?.NIK || localData?.dataTemp?.NIK || "",
      Alamat: localData?.pasien?.Alamat || localData?.dataTemp?.Alamat || "",
      TglMasuk: localData?.dataTemp?.TglMasuk.split("T")[0] || "",
      JenisKasus: localData?.kasus?.JenisKasus || localData?.dataTemp?.JenisKasus || "",
      JenisKunjungan: localData?.dataTemp?.JenisKunjungan || "",
      File: localData?.dataTemp?.Dokumen
        ? [localData.dataTemp.Dokumen]
        : [],
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
        return fail(response.status || 400, { toast: { type: 'error', message: json.message || 'Gagal mencari pasien' } });
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
      return fail(500, { toast: { type: 'error', message: err.message || 'Server error saat mencari pasien' } });
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
        return fail(response.status || 400, { toast: { type: 'error', message: json.message || 'Gagal mencari kasus' } });
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
      return fail(500, { toast: { type: 'error', message: err.message || 'Server error saat mencari kasus' } });
    }
  },
  updateKunjungan: async ({ params, request, fetch, cookies }) => {
    const formData = await request.formData();

    let localData = {};
    try {
      localData = JSON.parse(cookies.get('localData') || '{}');
    } catch { }

    if (!localData?.dataTemp.IDPasien || !localData?.dataTemp.IDKasus) {
      return fail(400, {
        toast: { type: 'error', message: 'Pasien atau kasus belum dipilih' }
      });
    }

    const payload = new FormData();
    payload.append('IdPasien', parseInt(localData?.dataTemp.IDPasien));
    payload.append('IdKasus', parseInt(localData?.dataTemp.IDKasus));
    payload.append('TglMasuk', formData.get('TglMasuk'));
    payload.append('JenisKunjungan', formData.get('JenisKunjungan'));

    const files = formData.getAll('File');
    files.forEach((file, index) => {
      if (file instanceof File && file.size > 0) {
        payload.append(`File`, file);
      }
    });

    try {
      const response = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/kunjungan/${params.slug}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${cookies.get('session_token') || ''}`
        },
        body: payload
      });

      const json = await response.json();

      if (!response.ok || json.status !== 'success') {
        return fail(response.status || 400, {
          toast: { type: 'error', message: json.message || 'Gagal memperbarui kunjungan' }
        });
      }

      cookies.delete('localData', { path: '/' });

      Object.keys(kunjunganCache.pages)
        .filter(k => k.startsWith('kunjungan:page:'))
        .forEach(key => {
          const pageData = kunjunganCache.get(key);
          if (!pageData) return;
          const index = pageData.kunjungan.data.findIndex(p => p.ID === payload.ID);
          if (index !== -1) {
            pageData.kunjungan.data[index] = { ...pageData.kunjungan.data[index], ...payload };
            kunjunganCache.set(key, pageData);
          }
        });

      return {
        success: true,
        toast: { type: 'success', message: 'Kunjungan berhasil diperbarui' },
        redirect: '/kunjungan'
      };
    } catch (err) {

      return fail(500, {
        success: false,
        toast: { type: 'error', message: err.message || 'Server error saat update kunjungan' }
      });
    }
  }
};
