"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { loginSchema } from "@/lib/validation";

export interface AuthState {
  ok: boolean;
  message?: string;
}

function sanitizeCallbackUrl(url: unknown): string {
  if (typeof url !== "string") return "/dashboard";
  if (!url.startsWith("/") || url.startsWith("//")) return "/dashboard";
  return url;
}

export async function loginWithCredentials(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ.",
    };
  }

  const callbackUrl = sanitizeCallbackUrl(formData.get("callbackUrl"));

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: callbackUrl,
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, message: "Email hoặc mật khẩu không chính xác." };
    }
    // NEXT_REDIRECT bắt buộc phải throw tiếp để Next chuyển trang
    throw error;
  }
}

export async function loginWithGitHub(formData: FormData): Promise<void> {
  const callbackUrl = sanitizeCallbackUrl(formData.get("callbackUrl"));

  // Kiểm tra cấu hình GitHub OAuth trong .env
  if (!process.env.AUTH_GITHUB_ID || !process.env.AUTH_GITHUB_SECRET) {
    redirect(
      `/login?error=Configuration&callbackUrl=${encodeURIComponent(callbackUrl)}`,
    );
  }

  try {
    await signIn("github", { redirectTo: callbackUrl });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(
        `/login?error=${encodeURIComponent(error.type)}&callbackUrl=${encodeURIComponent(callbackUrl)}`,
      );
    }
    throw error;
  }
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
