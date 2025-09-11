import { fail, redirect } from '@sveltejs/kit';
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
      const response = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/kasus`, {
        method: 'POST',
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
          toast: { type: 'error', message: responseData.message || 'Tambah kasus gagal' }
        });
      }

      // Object.keys(kasusCache.pages)
      //   .filter(key => key.startsWith('kasus:page:1:'))
      //   .forEach(key => {
      //     const pageData = kasusCache.get(key);
      //     if (!pageData) return;

      //     pageData.kasus.data.unshift(payload);
      //     pageData.kasus.total += 1;
      //     pageData.kasus.total_pages = Math.ceil(pageData.kasus.total / pageData.kasus.per_page);

      //     kasusCache.set(key, pageData);
      //   });
      kasusCache.clear()

      return {
        success: true,
        toast: { type: 'success', message: 'Data kasus berhasil ditambahkan' },
        redirect: '/kasus'
      };

    } catch (err) {
      return fail(500, {
        errors: {},
        values: data,
        toast: { type: 'error', message: err.message || 'Terjadi kesalahan saat menyimpan data' }
      });
    }
  }
};