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
      NoRM: localData?.dataTemp?.NoRM,
      NIK: localData?.dataTemp?.NIK,
      NamaPasien: localData?.dataTemp?.NamaPasien,
      JenisKelamin: localData?.dataTemp?.JenisKelamin,
      TglLahir: localData?.dataTemp?.TanggalLahir?.split("T")[0],
      Alamat: localData?.dataTemp?.Alamat,
    }
  };
}

export const actions = {
  default: async ({ params, request, fetch, cookies }) => {
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
      const response = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/pasien/${params.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('session_token')}`
        },
        body: JSON.stringify(payload)
      });

      const json = await response.json();

      if (!response.ok || json.status !== 'success') {
        return fail(400, {
          errors: {},
          values: data,
          toast: { type: 'error', message: json.message || 'Update pasien gagal' }
        });
      }

      cookies.delete('localData', { path: '/' });

      Object.keys(pasienCache.pages)
        .filter(k => k.startsWith('pasien:page:'))
        .forEach(key => {
          const pageData = pasienCache.get(key);
          if (!pageData) return;

          const index = pageData.pasien.data.findIndex(p => p.NoRM === payload.NoRM);
          if (index !== -1) {
            pageData.pasien.data[index] = { ...pageData.pasien.data[index], ...payload };
            pasienCache.set(key, pageData);
          }
        });

      return {
        success: true,
        toast: { type: 'success', message: 'Pasien berhasil diperbarui' },
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

