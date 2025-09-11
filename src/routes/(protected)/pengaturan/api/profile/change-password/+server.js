import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

const passwordSchema = z.object({
  old_password: z.string().min(8, "Password lama minimal 8 karakter"),
  new_password: z.string()
    .min(8, "Password baru minimal 8 karakter")
    .regex(/[A-Z]/, "Harus ada huruf besar")
    .regex(/[0-9]/, "Harus ada angka"),
});

export const POST = async ({ request, fetch, cookies }) => {
  const formData = Object.fromEntries(await request.formData());

  const result = passwordSchema.safeParse(formData);
  if (!result.success) {
    return fail(400, {
      toast: { type: "error", message: "Validasi gagal" },
      errors: result.error.flatten().fieldErrors
    });
  }

  try {
    const res = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/change-password`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cookies.get('session_token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result.data)
    });

    const responseData = await res.json();

    if (!res.ok || responseData.status !== 'success') {
      return fail(400, {
        toast: { type: "error", message: responseData.message || "Gagal ganti password" }
      });
    }

    return new Response(
      JSON.stringify({ toast: { type: 'success', message: 'Password berhasil diperbarui' } }),
      { status: 200 }
    );
  } catch (err) {
    return fail(500, { toast: { type: "error", message: err.message || "Terjadi kesalahan server" } });
  }
};
