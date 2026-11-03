"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { loginWithCredentials, loginWithGitHub } from "@/actions/auth";

interface LoginFormProps {
  callbackUrl: string;
  initialError?: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  Configuration:
    "Chức năng GitHub OAuth chưa có Client ID / Secret trong file .env. Vui lòng đăng nhập bằng 2 tài khoản kiểm thử bên dưới.",
  MissingCSRF:
    "Yêu cầu OAuth thiếu mã CSRF. Vui lòng sử dụng tài khoản Email/Mật khẩu bên dưới.",
  CredentialsSignin:
    "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.",
  OAuthAccountNotLinked:
    "Email tài khoản này đã được liên kết với một phương thức đăng nhập khác.",
  AccessDenied: "Bạn đã từ chối cấp quyền ủy quyền OAuth.",
};

export default function LoginForm({
  callbackUrl,
  initialError,
}: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginWithCredentials, {
    ok: true,
    message: "",
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activePreset, setActivePreset] = useState<"admin" | "sv" | null>(null);

  const fillAdmin = () => {
    setEmail("admin@ptit.edu.vn");
    setPassword("admin123");
    setActivePreset("admin");
  };

  const fillSv = () => {
    setEmail("sv@ptit.edu.vn");
    setPassword("sv123456");
    setActivePreset("sv");
  };

  const displayError =
    state.message ||
    (initialError
      ? ERROR_MESSAGES[initialError] || `Lỗi: ${initialError}`
      : "");

  return (
    <div className="w-full max-w-[460px] mx-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 sm:p-10 space-y-6">
        {/* Logo & Tiêu đề ngắn gọn */}
        <div className="text-center space-y-3">
          <Link
            href="/"
            aria-label="Về trang chủ PTIT Deadline Hub"
            className="inline-flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          >
            <div className="relative h-16 w-14 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Logo Học viện Công nghệ Bưu chính Viễn thông"
                width={56}
                height={73}
                priority
                className="h-16 w-auto object-contain drop-shadow-xs"
              />
            </div>
          </Link>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Đăng nhập
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Cổng học vụ sinh viên PTIT
            </p>
          </div>
        </div>

        {/* Nút chọn nhanh tài khoản kiểm thử */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
          <span className="text-xs font-bold text-slate-600 block">
            Chọn nhanh tài khoản:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillAdmin}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                activePreset === "admin"
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span>Ban cán sự</span>
            </button>
            <button
              type="button"
              onClick={fillSv}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                activePreset === "sv"
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span>Sinh viên</span>
            </button>
          </div>
        </div>

        {/* Thông báo lỗi nếu có */}
        {displayError && (
          <div
            role="alert"
            className="p-3.5 text-xs sm:text-sm text-red-700 bg-red-50 rounded-xl border border-red-200 flex items-start gap-2.5 leading-relaxed"
          >
            <svg
              className="w-5 h-5 shrink-0 text-red-600 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{displayError}</span>
          </div>
        )}

        {/* Form nhập tài khoản */}
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-bold text-slate-800"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setActivePreset(null);
                }}
                placeholder="Nhập email..."
                required
                autoComplete="email"
                spellCheck={false}
                className="w-full h-12 pl-10 pr-4 text-base bg-white border border-slate-300 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all text-slate-900 placeholder:text-slate-400 font-sans shadow-2xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-bold text-slate-800"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setActivePreset(null);
                }}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full h-12 pl-10 pr-4 text-base bg-white border border-slate-300 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all text-slate-900 placeholder:text-slate-400 font-sans shadow-2xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-base shadow-xs hover:shadow transition-all disabled:opacity-60 flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang xác thực…</span>
              </>
            ) : (
              <span>Đăng nhập</span>
            )}
          </button>
        </form>

        {/* Phân cách tối giản */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-xs text-slate-400 uppercase tracking-wider font-semibold absolute">
            hoặc
          </span>
        </div>

        {/* Nút đăng nhập GitHub gọn gàng */}
        <div>
          <form action={loginWithGitHub}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <button
              type="submit"
              className="w-full h-12 inline-flex items-center justify-center gap-2.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm sm:text-base font-bold rounded-xl shadow-2xs hover:border-slate-400 transition-all active:scale-[0.99] cursor-pointer"
            >
              <svg
                className="w-4 h-4 text-slate-900"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>Đăng nhập bằng GitHub</span>
            </button>
          </form>
        </div>

        {/* Nút quay lại trang chủ ngắn gọn */}
        <div className="pt-2 text-center">
          <Link
            href="/"
            className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5"
          >
            <span>&larr;</span>
            <span>Quay lại trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
