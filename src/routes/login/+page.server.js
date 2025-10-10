import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi")
});

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, fetch, cookies }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const result = loginSchema.safeParse(data);

    if (!result.success) {
      return fail(400, {
        errors: result.error.flatten().fieldErrors,
        values: { email: data.email },
        toast: {
          type: 'error',
          message: 'Harap perbaiki kesalahan pada form',
        }
      });
    }

    try {
      const response = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data)
      });

      const responseData = await response.json();

      if (!response.ok || responseData.status !== 'success') {
        return fail(400, {
          errors: {
            email: ['Email atau password salah'],
            password: [' ']
          },
          values: { email: data.email },
          toast: {
            type: 'error',
            message: responseData.message || 'Login gagal',
          }
        });
      }

      cookies.set('session_token', responseData.data, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24
      });

      return {
        success: true,
        toast: {
          type: 'success',
          message: 'Login berhasil!',
        },
        redirect: '/beranda'
      };

    } catch (err) {
      return fail(500, {
        errors: {
          email: ['Terjadi kesalahan server'],
          password: [' ']
        },
        values: { email: data.email },
        toast: {
          type: 'error',
          message: err.message || 'Terjadi kesalahan saat login',
        }
      });
    }
  },

};
