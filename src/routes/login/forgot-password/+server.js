import { z } from 'zod';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid")
});

export async function POST({ request, fetch }) {
  const form = await request.formData();
  const email = form.get('email')?.trim();

  const payload = forgotPasswordSchema.safeParse({ email });
  if (!payload.success) {
    return new Response(
      JSON.stringify({ toast: { type: 'error', message: payload.error.errors[0].message } }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const res = await fetch(`${PUBLIC_API_BASE_URL}/api/v2/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: payload.data.email })
    });

    let data;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      console.error('Non-JSON response:', text);
      return new Response(
        JSON.stringify({ toast: { type: 'error', message: 'Backend tidak merespon JSON' } }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!res.ok || data.status !== "success") {
      return new Response(
        JSON.stringify({ toast: { type: 'error', message: data.message || 'Gagal kirim email reset password' } }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ toast: { type: 'success', message: data.message || 'Email reset password telah dikirim' } }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ toast: { type: 'error', message: 'Terjadi kesalahan server' } }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
