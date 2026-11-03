import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getDeadlines, getSubjects, getUserCompletions } from "@/lib/data";
import { DeadlineFilter } from "@/components/deadline-filter";

// Chiến lược SSR (Server-Side Rendering) bắt buộc theo đề bài
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tiến độ học tập cá nhân — PTIT Deadline Hub",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const [subjects, deadlines] = await Promise.all([
    getSubjects(),
    getDeadlines(),
  ]);

  const userCompletions = await getUserCompletions(session.user.id);
  const completedCount = deadlines.filter((d) =>
    userCompletions.includes(d.id),
  ).length;
  const pendingCount = deadlines.length - completedCount;
  const completionRate =
    deadlines.length > 0
      ? Math.round((completedCount / deadlines.length) * 100)
      : 0;

  const urgentCount = deadlines.filter((d) => d.priority === "high").length;
  const urgentCompleted = deadlines
    .filter((d) => d.priority === "high")
    .filter((d) => userCompletions.includes(d.id)).length;

  // Lumino-Style Subject Distribution
  const subjectStats = subjects.map((sub) => {
    const subDeadlines = deadlines.filter((d) => d.subjectSlug === sub.slug);
    const subCompleted = subDeadlines.filter((d) =>
      userCompletions.includes(d.id),
    ).length;
    const rate =
      subDeadlines.length > 0
        ? Math.round((subCompleted / subDeadlines.length) * 100)
        : 0;
    return {
      ...sub,
      total: subDeadlines.length,
      completed: subCompleted,
      pending: subDeadlines.length - subCompleted,
      rate,
    };
  });

  return (
    <div className="space-y-8">
      {/* Lumino Admin Profile & Overview Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          {/* User Profile Left (Lumino Admin Style) */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 to-red-900 text-white flex items-center justify-center font-black text-xl shadow-xs">
                {(session.user.name || "SV").charAt(0).toUpperCase()}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {session.user.name || session.user.email}
                </h1>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/70 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ONLINE
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1 font-medium">
                <span>Mã SV: <strong className="text-slate-700 font-mono">B23DCCC127</strong></span>
                <span>•</span>
                <span>Lớp: <strong className="text-slate-700">D23CQCN01-B</strong></span>
                <span>•</span>
                <span>Khóa: <strong className="text-slate-700">2023 – 2028</strong></span>
              </div>
            </div>
          </div>

          {/* Role & Server Status */}
          <div className="flex items-center gap-3">
            <span
              className={`text-xs uppercase font-bold px-3 py-1.5 rounded-xl border ${
                session.user.role === "admin"
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }`}
            >
              {session.user.role === "admin"
                ? "Ban cán sự lớp (Admin)"
                : "Sinh viên chính quy"}
            </span>

            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200/70 px-3 py-1.5 rounded-xl">
              SSR DYNAMIC
            </span>
          </div>
        </div>

        {/* 4 Lumino-Style Color KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Tổng số bài (Blue) */}
          <div className="bg-gradient-to-br from-blue-50/50 to-white p-5 rounded-2xl border border-blue-200/70 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-blue-800 uppercase font-bold tracking-wider block">
                Tổng số bài tập
              </span>
              <span className="text-3xl font-black text-slate-900 tabular-nums">
                {deadlines.length}
              </span>
              <span className="text-xs text-blue-600 block font-medium">
                toàn bộ học kỳ
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>

          {/* Card 2: Đã hoàn thành (Emerald) */}
          <div className="bg-gradient-to-br from-emerald-50/50 to-white p-5 rounded-2xl border border-emerald-200/70 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-emerald-800 uppercase font-bold tracking-wider block">
                Đã hoàn thành
              </span>
              <span className="text-3xl font-black text-emerald-700 tabular-nums">
                {completedCount}
              </span>
              <span className="text-xs text-emerald-600 block font-medium">
                đạt {completionRate}% nghĩa vụ
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Card 3: Chưa hoàn thành (Amber) */}
          <div className="bg-gradient-to-br from-amber-50/50 to-white p-5 rounded-2xl border border-amber-200/70 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-amber-800 uppercase font-bold tracking-wider block">
                Chưa hoàn thành
              </span>
              <span className="text-3xl font-black text-amber-700 tabular-nums">
                {pendingCount}
              </span>
              <span className="text-xs text-amber-600 block font-medium">
                nhiệm vụ cần nộp
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Card 4: Ưu tiên cao (Rose) */}
          <div className="bg-gradient-to-br from-rose-50/50 to-white p-5 rounded-2xl border border-rose-200/70 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-rose-800 uppercase font-bold tracking-wider block">
                Ưu tiên cao
              </span>
              <span className="text-3xl font-black text-rose-600 tabular-nums">
                {urgentCount}
              </span>
              <span className="text-xs text-rose-600 block font-medium">
                đã xong {urgentCompleted}/{urgentCount} bài
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Thanh Tiến Độ Tổng Thể (Overall Progress Bar) */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700">
            <span>Tiến độ hoàn thành toàn bộ nghĩa vụ học tập:</span>
            <span className="font-mono text-slate-900 text-sm">
              {completedCount}/{deadlines.length} bài ({completionRate}%)
            </span>
          </div>
          <div className="w-full h-3.5 bg-slate-100 rounded-full border border-slate-200/80 overflow-hidden p-0.5">
            <div
              className="h-full bg-slate-900 rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lumino-Style Subject Distribution Overview (Tiến độ 4 học phần) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-700">
              PHÂN BỔ THEO HỌC PHẦN
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Tiến độ chi tiết từng môn học
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Tự động đồng bộ theo tài khoản
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjectStats.map((sub) => (
            <div
              key={sub.slug}
              className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                  {sub.code}
                </span>
                <span className="text-xs font-bold font-mono text-slate-900">
                  {sub.completed}/{sub.total} bài
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm truncate">
                  {sub.name}
                </h3>
                <span className="text-[11px] text-slate-500 font-medium block truncate">
                  {sub.lecturer}
                </span>
              </div>

              {/* Progress bar per subject */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                  <span>Hoàn tất</span>
                  <span className="font-mono font-bold text-slate-900">{sub.rate}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      sub.rate === 100
                        ? "bg-emerald-600"
                        : sub.rate > 50
                        ? "bg-blue-600"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${sub.rate}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 1Office-Style Personal Task Management Sổ Deadline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Sổ nhiệm vụ cá nhân (Tự đánh dấu hoàn thành)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Sử dụng các tab trạng thái để lọc nhanh bài tập. Bấm vào trạng thái để đánh dấu nộp bài.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
            TỰ LƯU VÀO MÁY CHỦ
          </span>
        </div>

        <DeadlineFilter
          initialDeadlines={deadlines}
          subjects={subjects}
          userCompletions={userCompletions}
          canMark={true}
        />
      </div>
    </div>
  );
}
