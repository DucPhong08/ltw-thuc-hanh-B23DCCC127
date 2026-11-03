import { auth } from "@/auth";
import { DashboardNav } from "@/components/dashboard-nav";

export default async function DashboardNestedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";
  const user = session?.user;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar Hồ Sơ Học Viên & Menu Điều Hướng */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs sticky top-20 space-y-5">
          <div className="pb-4 border-b border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Hồ sơ học vụ
            </span>
            <span className="text-sm font-bold text-slate-900 block truncate">
              {user?.name || "Sinh viên PTIT"}
            </span>
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>Đang theo học • Học kỳ I</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-1">
              Danh mục hồ sơ
            </span>
            <DashboardNav isAdmin={isAdmin} />
          </div>
        </div>
      </aside>

      {/* Main child area */}
      <section className="flex-1 min-w-0">{children}</section>
    </div>
  );
}
