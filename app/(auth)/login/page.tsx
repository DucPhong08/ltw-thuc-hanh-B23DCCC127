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
  const isGitHubConfigured = Boolean(
    process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET,
  );

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-[#f8fafc] px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Header thương hiệu */}
      <div className="w-full max-w-[480px] flex items-center justify-between text-xs sm:text-sm text-slate-500 font-medium pb-4 z-10">
        <span className="font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-pulse" />
          Học viện Công nghệ Bưu chính Viễn thông
        </span>
        <span className="font-mono text-xs text-slate-400">PTIT • 2026</span>
      </div>

      {/* Main card */}
      <div className="w-full flex justify-center items-center my-auto z-10">
        <LoginForm
          callbackUrl={params.callbackUrl || "/dashboard"}
          initialError={params.error}
          isGitHubConfigured={isGitHubConfigured}
        />
      </div>

      {/* Footer bản quyền */}
      <div className="w-full max-w-[480px] text-center text-xs text-slate-400 pt-6 z-10">
        © 2026 Học viện Công nghệ Bưu chính Viễn thông • Cổng deadline lớp học
      </div>
    </div>
  );
}
