import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { PortalFooter } from "@/components/portal-footer";

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const roleLabel =
    user.role === "admin" ? "Ban cán sự lớp (Admin)" : "Sinh viên";

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      {/* Dải Thông Tin Thể Thức Hành Chính Đầu Trang */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 border-b border-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span className="font-bold text-white tracking-wide uppercase text-[11px] sm:text-xs">
              Học viện Công nghệ Bưu chính Viễn thông
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline text-xs">Khoa Công nghệ Thông tin</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <span>Cổng Học Vụ Chính Quy • Học kỳ I (2026 – 2027)</span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="hidden md:inline font-mono text-slate-300">bcs.cntt@ptit.edu.vn</span>
          </div>
        </div>
      </div>

      {/* Modern Administrative Topbar with Official Logo */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 h-20 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative h-11 w-9 shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Học viện Công nghệ Bưu chính Viễn thông"
                  width={40}
                  height={52}
                  priority
                  className="h-11 w-auto object-contain drop-shadow-xs"
                />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-base leading-tight tracking-tight block">
                  PTIT Deadline Hub
                </span>
                <span className="text-xs text-slate-500 font-medium hidden sm:block">
                  Cổng học vụ sinh viên chính quy
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-2 text-sm font-semibold">
              <Link
                href="/dashboard"
                className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-900 border border-slate-200/80 hover:bg-slate-200 transition-colors"
              >
                Tiến độ học tập
              </Link>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="px-3.5 py-2 rounded-xl bg-red-50 text-red-700 border border-red-200/70 hover:bg-red-100 transition-colors"
                >
                  Nghiệp vụ Quản trị
                </Link>
              )}
              <Link
                href="/"
                className="px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors"
              >
                &larr; Cổng công khai
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right text-xs sm:text-sm">
              <span className="font-bold text-slate-900 block leading-tight">
                {user.name}
              </span>
              <span
                className={`inline-block text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mt-0.5 ${
                  user.role === "admin"
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                }`}
              >
                {roleLabel}
              </span>
            </div>

            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="text-sm sm:text-base font-bold px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition-all cursor-pointer"
              >
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Expansive Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12">
        {children}
      </main>

      {/* Chuẩn Thể Thức Footer Hành Chính */}
      <PortalFooter />
    </div>
  );
}
