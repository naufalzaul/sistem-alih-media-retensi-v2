import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

const registerSchema = z.object({
  name: z.string()
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  email: z.string()
    .email("Email tidak valid")
    .endsWith("@gmail.com", "Harus menggunakan domain RS Widodo Ngawi"),
  password: z.string()
    .min(8, "Password minimal 8 karakter")
    .regex(/[A-Z]/, "Harus mengandung huruf besar")
    .regex(/[0-9]/, "Harus mengandung angka"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Password tidak sama",
  path: ["confirmPassword"]
});

export const actions = {
  default: async ({ request, fetch }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const result = registerSchema.safeParse(data);
    if (!result.success) {
      return fail(400, {
        errors: result.error.flatten().fieldErrors,
        values: {
          name: data.name,
          email: data.email,
          password: '',
          confirmPassword: ''
        },
        toast: {
          type: 'error',
          message: 'Validasi form gagal'
        }
      });
    }

    const response = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: result.data.name,
        email: result.data.email,
        password: result.data.password
      })
    });

    const { message } = await response.json();

    if (!response.ok) {
      return fail(response.status, {
        errors: {
          email: [message?.includes('Email') ? message : 'Registrasi gagal'],
          password: ['']
        },
        values: {
          name: data.name,
          email: data.email,
          password: '',
          confirmPassword: ''
        },
        toast: {
          type: 'error',
          message: message || 'Registrasi gagal'
        }
      });
    }

    return {
      toast: {
        type: 'success',
        message: 'Registrasi berhasil! Mengarahkan ke halaman login...'
      },
      redirect: '/login'
    };
  }
};
