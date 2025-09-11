import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

const infoSchema = z.object({
  id: z.string().min(1, "ID tidak boleh kosong"),
  NamaAplikasi: z.string().min(1, "Nama aplikasi minimal 2 karakter"),
  Logo: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file) return true;
        return file instanceof File;
      },
      "Logo harus berupa file"
    )
    .refine(
      (file) => {
        if (!file) return true;
        return file.size <= 1 * 1024 * 1024;
      },
      "Ukuran maksimal 1MB"
    )
    .refine(
      (file) => {
        if (!file) return true;
        return ["image/jpg", "image/jpeg", "image/png", "image/svg+xml"].includes(file.type);
      },
      "Format harus JPG, PNG, atau SVG"
    ),
});


export const POST = async ({ request, fetch, cookies }) => {
  const form = await request.formData();

  const formData = Object.fromEntries(form);

  if (formData.Logo && formData.Logo.size === 0) {
    delete formData.Logo;
  }

  const result = infoSchema.safeParse(formData);


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
    const bodyForm = new FormData();
    for (const [key, value] of form.entries()) {
      bodyForm.append(key, value);
    }


    const res = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/info-sistem/${formData.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cookies.get('session_token')}`
      },
      body: bodyForm
    });

    const responseData = await res.json();

    if (!res.ok || responseData.status !== 'success') {
      return json(
        {
          status: 'error',
          toast: {
            type: 'error',
            message: responseData.message || 'Gagal memperbarui info sistem'
          }
        },
        { status: 400 }
      );
    }

    return json(
      {
        status: 'success',
        toast: { type: 'success', message: 'Info sistem berhasil diperbarui' },
        redirect: '/pengaturan'
      },
      { status: 200 }
    );
  } catch (err) {
    return json(
      {
        status: 'error',
        toast: {
          type: 'error',
          message: err.message || 'Terjadi kesalahan server'
        }
      },
      { status: 500 }
    );
  }
};
