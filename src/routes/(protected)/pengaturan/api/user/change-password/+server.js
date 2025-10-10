import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

const passwordSchema = z.object({
  id: z.string().min(1, "User ID tidak boleh kosong"),
  old_password: z.string()
    .min(8, "Password lama minimal 8 karakter")
    .regex(/[A-Z]/, "Harus mengandung huruf besar")
    .regex(/[0-9]/, "Harus mengandung angka"),
  new_password: z.string()
    .min(8, "Password baru minimal 8 karakter")
    .regex(/[A-Z]/, "Harus mengandung huruf besar")
    .regex(/[0-9]/, "Harus mengandung angka")
});

export const POST = async ({ request, fetch, cookies }) => {
  const formData = Object.fromEntries(await request.formData());
  const result = passwordSchema.safeParse(formData);

  if (!result.success) {
    return json(
      {
        status: "error",
        errors: result.error.flatten().fieldErrors,
        toast: { type: "error", message: "Validasi gagal" }
      },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `${PUBLIC_API_BASE_URL}/api/v2/users/${formData.id}/password`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${cookies.get("session_token")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          old_password: formData.old_password,
          new_password: formData.new_password
        })
      }
    );

    const responseData = await res.json();

    if (!res.ok || responseData.status !== "success") {
      return json(
        {
          status: "error",
          toast: {
            type: "error",
            message: responseData.message || "Gagal mengubah password"
          }
        },
        { status: 400 }
      );
    }

    return json(
      {
        status: "success",
        toast: { type: "success", message: "Password berhasil diubah" },
        redirect: '/pengaturan'
      },
      { status: 200 }
    );
  } catch (err) {
    return json(
      {
        status: "error",
        toast: {
          type: "error",
          message: err.message || "Terjadi kesalahan server"
        }
      },
      { status: 500 }
    );
  }
};
