import { fail, redirect, error } from '@sveltejs/kit';
import { z } from 'zod';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { kasusCache } from '$lib/cache/kasus.js';

const kasusSchema = z.object({
  JenisKasus: z.string().min(1, "Jenis kasus wajib diisi"),
  MasaAktifRi: z.coerce.number().min(0, "Nilai tidak boleh negatif"),
  MasaInaktifRi: z.coerce.number().min(0, "Nilai tidak boleh negatif"),
  MasaAktifRj: z.coerce.number().min(0, "Nilai tidak boleh negatif"),
  MasaInaktifRj: z.coerce.number().min(0, "Nilai tidak boleh negatif"),
  InfoLain: z.string().optional()
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
    defaultValues: {
      JenisKasus: localData?.dataTemp?.JenisKasus || '',
      MasaAktifRi: localData?.dataTemp?.MasaAktifRI ?? 0,
      MasaInaktifRi: localData?.dataTemp?.MasaInaktifRI ?? 0,
      MasaAktifRj: localData?.dataTemp?.MasaAktifRJ ?? 0,
      MasaInaktifRj: localData?.dataTemp?.MasaInaktifRJ ?? 0,
      InfoLain: localData?.dataTemp?.InfoLain || ''
    }
  };
};

export const actions = {
  default: async ({ request, fetch, cookies, params }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const payload = kasusSchema.safeParse(data);
    if (!payload.success) {
      return fail(400, {
        errors: payload.error.flatten().fieldErrors,
        values: data,
        toast: { type: 'error', message: 'Validasi gagal, periksa input Anda' }
      });
    }

    try {
      const response = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/kasus/${params.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('session_token')}`
        },
        body: JSON.stringify(payload.data)
      });

      const responseData = await response.json();

      if (!response.ok || responseData.status !== 'success') {
        return fail(400, {
          errors: {},
          values: data,
          toast: { type: 'error', message: json.message || 'Update kasus gagal' }
        });
      }

      cookies.delete('localData', { path: '/' });

      Object.keys(kasusCache.pages)
        .filter(k => k.startsWith('kasus:page:'))
        .forEach(key => {
          const pageData = kasusCache.get(key);
          if (!pageData) return;

          const index = pageData.kasus.data.findIndex(p => p.JenisKasus === payload.JenisKasus);
          if (index !== -1) {
            pageData.kasus.data[index] = { ...pageData.kasus.data[index], ...payload };
            kasusCache.set(key, pageData);
          }
        });


      return {
        success: true,
        toast: { type: 'success', message: 'Data kasus berhasil diperbarui' },
        redirect: '/kasus'
      };

    } catch (err) {
      return fail(500, {
        errors: {},
        values: data,
        toast: { type: 'error', message: err.message || 'Terjadi kesalahan saat memperbarui data' }
      });
    }
  }
};