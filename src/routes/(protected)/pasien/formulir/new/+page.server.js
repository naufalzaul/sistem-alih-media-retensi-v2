import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { pasienCache } from '$lib/cache/pasien.js';

const patientSchema = z.object({
  NoRM: z.string().min(1, 'No RM wajib diisi'),
  NIK: z.string()
    .min(16, 'NIK harus 16 digit')
    .max(16, 'NIK harus 16 digit')
    .regex(/^\d+$/, 'NIK hanya boleh berisi angka'),
  NamaPasien: z.string().min(3, 'Nama minimal 3 karakter'),
  TglLahir: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal tidak valid'),
  JenisKelamin: z.enum(['Laki-Laki', 'Perempuan'], { required_error: 'Pilih jenis kelamin' }),
  Alamat: z.string().min(5, 'Alamat minimal 5 karakter'),
  Status: z.enum(['Aktif', 'Tidak Aktif'], { required_error: 'Pilih status pasien' })
});

export const actions = {
  default: async ({ request, fetch, cookies }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const result = patientSchema.safeParse(data);
    if (!result.success) {
      return fail(400, {
        errors: result.error.flatten().fieldErrors,
        values: data,
        toast: { type: 'error', message: 'Validasi gagal, periksa input Anda' }
      });
    }

    const payload = {
      ...result.data,
      TglLahir: new Date(result.data.TglLahir).toISOString(),
    };

    try {
      const pasienResponse = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/pasien`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('session_token')}`
        },
        body: JSON.stringify(payload)
      });

      const pasienJson = await pasienResponse.json();

      if (!pasienResponse.ok || pasienJson.status !== 'success') {
        return fail(400, {
          errors: {},
          values: data,
          toast: { type: 'error', message: pasienJson.message || 'Pendaftaran pasien gagal' }
        });
      }

      Object.keys(pasienCache.pages)
        .filter(key => key.startsWith('pasien:page:1:'))
        .forEach(key => {
          const pageData = pasienCache.get(key);
          if (!pageData?.pasien?.data) return;

          const newPatient = pasienJson.data; // dari response API
          pageData.pasien.data.unshift(newPatient);

          // jika ingin jaga max per_page, bisa splice
          if (pageData.pasien.data.length > pageData.pasien.per_page) {
            pageData.pasien.data.splice(pageData.pasien.per_page);
          }

          pageData.pasien.total += 1;
          pageData.pasien.total_pages = Math.ceil(pageData.pasien.total / pageData.pasien.per_page);

          pasienCache.set(key, pageData);
        });

      // Object.keys(pasienCache.pages)
      //   .filter(key => key.startsWith('pasien:page:'))
      //   .forEach(key => {
      //     const pageData = pasienCache.get(key);
      //     if (!pageData) return;


      //     pageData.pasien.data.unshift(payload);
      //     pageData.pasien.total += 1;
      //     pageData.pasien.total_pages = Math.ceil(pageData.pasien.total / pageData.pasien.per_page);

      //     console.log(pageData.pasien);

      //     pasienCache.set(key, pageData);
      //   });

      return {
        success: true,
        toast: { type: 'success', message: 'Pasien berhasil ditambahkan' },
        redirect: '/pasien'
      };
    } catch (error) {
      return fail(500, {
        errors: {},
        values: data,
        toast: { type: 'error', message: error.message || 'Terjadi kesalahan server' }
      });
    }
  }
};