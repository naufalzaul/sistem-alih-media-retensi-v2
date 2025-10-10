import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

const resetSchema = z.object({
  token: z.string().min(10, 'Token tidak valid'),
  new_password: z.string().min(6, 'Password minimal 6 karakter'),
});

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, fetch }) => {
    const formData = Object.fromEntries(await request.formData());
    const result = resetSchema.safeParse(formData);

    if (!result.success) {
      return fail(400, {
        toast: { type: 'error', message: 'Validasi gagal, periksa input Anda' },
        errors: result.error.flatten().fieldErrors
      });
    }

    try {

      const res = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data)
      });

      const responseData = await res.json();

      if (!res.ok || responseData.status !== 'success') {
        return fail(400, {
          toast: { type: 'error', message: responseData.message || 'Gagal reset password' }
        });
      }

      return {
        success: true,
        toast: {
          type: 'success',
          message: 'Password berhasil diperbarui, silakan login kembali',
        },
        redirect: '/login'
      };
    } catch (err) {
      console.error('Reset password gagal:', err);
      return fail(500, {
        toast: { type: 'error', message: 'Terjadi kesalahan server, coba lagi nanti' }
      });
    }
  }
};
