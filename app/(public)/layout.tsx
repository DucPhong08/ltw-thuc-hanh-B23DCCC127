import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { UserMenu } from "@/components/user-menu";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Modern Administrative Header with Glassmorphism — Widescreen Container */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 h-20 flex items-center justify-between gap-6">
          {/* Official PTIT Logo & Portal Identity */}
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative h-12 w-10 sm:h-13 sm:w-11 shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Học viện Công nghệ Bưu chính Viễn thông"
                  width={44}
                  height={58}
                  priority
                  className="h-11 sm:h-12 w-auto object-contain drop-shadow-xs"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight tracking-tight">
                    PTIT Deadline Hub
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full border border-red-200/70 font-mono">
                    Học kỳ I
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium block">
                  Học viện Công nghệ Bưu chính Viễn thông
                </span>
              </div>
            </Link>

            {/* Navigation Links — Roomier and more readable */}
            <nav className="hidden xl:flex items-center gap-1.5 text-sm font-semibold text-slate-600">
              <Link
                href="/"
                className="px-3.5 py-2 rounded-xl hover:text-slate-900 hover:bg-slate-100/80 transition-colors"
              >
                Trang chủ
              </Link>
              <Link
                href="/deadlines"
                className="px-3.5 py-2 rounded-xl hover:text-slate-900 hover:bg-slate-100/80 transition-colors flex items-center gap-2"
              >
                <span>Sổ Deadline</span>
                <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/60">
                  12
                </span>
              </Link>
              <div className="h-4 w-px bg-slate-200 mx-2" />
              <Link
                href="/subjects/ltwnc"
                className="px-3 py-2 rounded-xl hover:text-slate-900 hover:bg-slate-100/80 transition-colors"
              >
                LTW Nâng cao
              </Link>
              <Link
                href="/subjects/ktmt"
                className="px-3 py-2 rounded-xl hover:text-slate-900 hover:bg-slate-100/80 transition-colors"
              >
                KT Máy tính
              </Link>
              <Link
                href="/subjects/mmt"
                className="px-3 py-2 rounded-xl hover:text-slate-900 hover:bg-slate-100/80 transition-colors"
              >
                Mạng máy tính
              </Link>
              <Link
                href="/subjects/csdl"
                className="px-3 py-2 rounded-xl hover:text-slate-900 hover:bg-slate-100/80 transition-colors"
              >
                Cơ sở dữ liệu
              </Link>
            </nav>
          </div>

          {/* User Auth Section */}
          <div className="flex items-center gap-4">
            <Suspense
              fallback={
                <div className="h-10 w-28 bg-slate-100 rounded-xl animate-pulse" />
              }
            >
              <UserMenu />
            </Suspense>
          </div>
        </div>
      </header>

      {/* Main Content Area — Expansive Widescreen Width */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12">
        {children}
      </main>

      {/* Modern Administrative Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-10 mt-auto">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500">
          <div className="flex items-center gap-3">
            <div className="relative h-6 w-5 shrink-0">
              <Image
                src="/logo.png"
                alt="Logo PTIT"
                width={20}
                height={26}
                className="h-6 w-auto object-contain"
              />
            </div>
            <span className="font-bold text-slate-800">PTIT Deadline Hub</span>
            <span>•</span>
            <span>Học viện Công nghệ Bưu chính Viễn thông</span>
            <span>•</span>
            <span className="font-mono text-slate-400">
              Năm học 2026 – 2027
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold">
            <Link
              href="/deadlines"
              className="hover:text-slate-900 transition-colors"
            >
              Sổ Deadline (12)
            </Link>
            <Link
              href="/dashboard"
              className="hover:text-slate-900 transition-colors"
            >
              Tiến độ cá nhân
            </Link>
            <Link
              href="/login"
              className="hover:text-slate-900 transition-colors"
            >
              Đăng nhập sinh viên
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
