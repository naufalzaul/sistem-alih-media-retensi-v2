import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { pemusnahanCache } from '$lib/cache/pemusnahan.js';

const pemusnahanSchema = z.object({
  IdKunjungan: z.string().min(1, 'Id Kunjungan wajib diisi')
    .transform((val) => Number(val)),
  TglLaporan: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal tidak valid'),
  Status: z.string().min(1, 'Status wajib diisi')
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
      statusOption: ["Belum dimusnahkan", "Sudah dimusnahkan"]
    },
    defaultValues: {
      IdKunjungan: localData?.dataTemp?.ID ?? "",
      TglLaporan: new Date().toISOString().split("T")[0],
      Status: localData?.dataTemp?.Status ?? ""
    }
  };
}

export const actions = {
  default: async ({ request, fetch, cookies }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const result = pemusnahanSchema.safeParse(data);
    if (!result.success) {
      return fail(400, {
        errors: result.error.flatten().fieldErrors,
        toast: { type: 'error', message: 'Validasi gagal, periksa input Anda' }
      });
    }

    const payload = {
      ...result.data,
      TglLaporan: new Date(result.data.TglLaporan).toISOString(),
    };

    try {
      const response = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/pemusnahan/${payload.IdKunjungan}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('session_token')}`
        },
        body: JSON.stringify(payload)
      });

      const json = await response.json();

      if (json.status !== 'success') {
        return fail(400, {
          errors: {},
          toast: { type: 'error', message: json.message || 'Simpan pemusnahan gagal' }
        });
      }

      cookies.delete('localData', { path: '/' });

      pemusnahanCache.clear();

      return {
        success: true,
        toast: { type: 'success', message: 'Data pemusnahan berhasil disimpan' },
        redirect: '/transaksi/pemusnahan'
      };
    } catch (error) {
      return fail(500, {
        errors: {},
        toast: { type: 'error', message: error.message || 'Terjadi kesalahan server' }
      });
    }
  }
};
