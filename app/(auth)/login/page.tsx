import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Đăng nhập — PTIT Deadline Hub",
  description:
    "Đăng nhập tài khoản sinh viên hoặc ban cán sự lớp để quản lý deadline.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f8fafc] px-4 py-8 sm:py-12 relative">
      <div className="w-full flex justify-center items-center my-auto">
        <LoginForm
          callbackUrl={params.callbackUrl || "/dashboard"}
          initialError={params.error}
        />
      </div>

      <div className="text-center text-xs text-slate-400 pt-6">
        Học viện Công nghệ Bưu chính Viễn thông • Khoa CNTT
      </div>
    </div>
  );
}
