import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { resetProfileCache } from '$lib/cache/profile.js';

const profileSchema = z.object({
  name: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
});

export const POST = async ({ request, fetch, cookies }) => {
  const formData = Object.fromEntries(await request.formData());

  const result = profileSchema.safeParse(formData);
  if (!result.success) {
    return fail(400, {
      toast: { type: "error", message: "Validasi gagal" },
      errors: result.error.flatten().fieldErrors
    });
  }

  try {
    const res = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/profile`, {
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
        toast: { type: "error", message: responseData.message || "Gagal update profil" }
      });
    }

    resetProfileCache();

    return new Response(
      JSON.stringify({ toast: { type: 'success', message: 'Profil berhasil diperbarui' } }),
      { status: 200 }
    );
  } catch (err) {
    return fail(500, { toast: { type: "error", message: err.message || "Terjadi kesalahan server" } });
  }
};
