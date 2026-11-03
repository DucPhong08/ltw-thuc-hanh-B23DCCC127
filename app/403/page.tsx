import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "403 — Không có quyền truy cập",
  robots: { index: false, follow: false },
};

export default function ForbiddenPage() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/80 p-8 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200/60">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m0 0v.01m0-6V7a4 4 0 00-8 0v4m8 0a4 4 0 018 0v4H4v-4z"
            />
          </svg>
        </div>
        <span className="text-2xl font-bold text-slate-900 block mb-1">
          403 — Quyền truy cập bị từ chối
        </span>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Khu vực nghiệp vụ này yêu cầu đặc quyền{" "}
          <strong>Lớp trưởng (Admin)</strong>. Tài khoản của bạn hiện tại không
          đủ thẩm quyền truy cập.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
          >
            Về Dashboard cá nhân
          </Link>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl transition-all"
          >
            Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
