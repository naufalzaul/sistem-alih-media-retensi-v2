import { json, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

const userSchema = z.object({
  name: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  role: z.enum(["admin", "user"], {
    errorMap: () => ({ message: "Role tidak valid" })
  }),
  status: z.enum(["Aktif", "Tidak Aktif"], {
    errorMap: () => ({ message: "Status tidak valid" })
  })
});

export const POST = async ({ request, fetch, cookies }) => {
  const formData = Object.fromEntries(await request.formData());
  const result = userSchema.safeParse(formData);

  if (!result.success) {
    return json(
      {
        status: 'error',
        errors: result.error.flatten().fieldErrors,
        toast: { type: 'error', message: 'Validasi gagal' }
      },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/users/${formData.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cookies.get('session_token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result.data)
    });

    const responseData = await res.json();

    if (!res.ok || responseData.status !== 'success') {
      return json(
        {
          status: 'error',
          toast: { type: 'error', message: responseData.message || 'Gagal memperbarui data user' }
        },
        { status: 400 }
      );
    }

    return json(
      {
        status: 'success',
        toast: { type: 'success', message: 'Data user berhasil diperbarui' },
        redirect: '/pengaturan'
      },
      { status: 200 }
    );
  } catch (err) {
    return json(
      {
        status: 'error',
        toast: { type: 'error', message: err.message || 'Terjadi kesalahan server' }
      },
      { status: 500 }
    );
  }
};
