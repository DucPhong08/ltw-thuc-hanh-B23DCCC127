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

  // Phân bổ tiến độ theo từng học phần
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
      {/* Khung Thông Tin Cá Nhân & Chỉ Số — Thiết kế trang nhã, màu sắc đồng nhất */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          {/* Thông tin sinh viên */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-xs">
                {(session.user.name || "SV").charAt(0).toUpperCase()}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {session.user.name || session.user.email}
                </h1>
                <span className="text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  ONLINE
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600 mt-1 font-medium">
                <span>Mã SV: <strong className="text-slate-900 font-mono">B23DCCC127</strong></span>
                <span>•</span>
                <span>Lớp: <strong className="text-slate-900">D23CQCN01-B</strong></span>
                <span>•</span>
                <span>Khóa: <strong className="text-slate-900">2023 – 2028</strong></span>
              </div>
            </div>
          </div>

          {/* Vai trò tài khoản */}
          <div className="flex items-center gap-3">
            <span
              className={`text-xs sm:text-sm uppercase font-bold px-4 py-2 rounded-xl border ${
                session.user.role === "admin"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-slate-100 text-slate-800 border-slate-200"
              }`}
            >
              {session.user.role === "admin"
                ? "Ban cán sự lớp (Admin)"
                : "Sinh viên chính quy"}
            </span>

            <span className="text-xs sm:text-sm font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-xl">
              SSR DYNAMIC
            </span>
          </div>
        </div>

        {/* 4 Thẻ Chỉ Số Học Vụ Đồng Nhất — Nền trắng, viền thanh lịch, chữ to */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Tổng số bài */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs sm:text-sm text-slate-500 uppercase font-bold tracking-wider block">
              Tổng số bài tập
            </span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums">
              {deadlines.length}
            </div>
            <span className="text-xs sm:text-sm text-slate-600 block font-medium">
              toàn bộ học kỳ
            </span>
          </div>

          {/* Card 2: Đã hoàn thành */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs sm:text-sm text-emerald-800 uppercase font-bold tracking-wider block">
              Đã hoàn thành
            </span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-700 tabular-nums">
              {completedCount}
            </div>
            <span className="text-xs sm:text-sm text-emerald-700 block font-medium">
              đạt {completionRate}% nghĩa vụ
            </span>
          </div>

          {/* Card 3: Chưa hoàn thành */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs sm:text-sm text-slate-500 uppercase font-bold tracking-wider block">
              Chưa hoàn thành
            </span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums">
              {pendingCount}
            </div>
            <span className="text-xs sm:text-sm text-slate-600 block font-medium">
              nhiệm vụ cần nộp
            </span>
          </div>

          {/* Card 4: Ưu tiên cao */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs sm:text-sm text-red-700 uppercase font-bold tracking-wider block">
              Ưu tiên cao
            </span>
            <div className="text-3xl sm:text-4xl font-black text-red-700 tabular-nums">
              {urgentCount}
            </div>
            <span className="text-xs sm:text-sm text-red-700 block font-semibold">
              đã xong {urgentCompleted}/{urgentCount} bài
            </span>
          </div>
        </div>

        {/* Thanh Tiến Độ Hoàn Thành Toàn Khóa */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-sm sm:text-base font-bold text-slate-800">
            <span>Tiến độ hoàn thành toàn bộ nghĩa vụ học tập:</span>
            <span className="font-mono text-slate-900 font-black">
              {completedCount}/{deadlines.length} bài ({completionRate}%)
            </span>
          </div>
          <div className="w-full h-4 bg-slate-100 rounded-full border border-slate-200 overflow-hidden p-0.5">
            <div
              className="h-full bg-slate-900 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Khung Tiến Độ 4 Học Phần */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-red-700">
              PHÂN BỔ THEO HỌC PHẦN
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Tiến độ chi tiết từng môn học
            </h2>
          </div>
          <span className="text-sm text-slate-500 font-medium hidden sm:inline">
            Tự động đồng bộ theo tài khoản
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {subjectStats.map((sub) => (
            <div
              key={sub.slug}
              className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs sm:text-sm font-bold text-slate-800 bg-white border border-slate-200 px-3 py-1 rounded-md">
                  {sub.code}
                </span>
                <span className="text-sm font-bold font-mono text-slate-900">
                  {sub.completed}/{sub.total} bài
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg truncate">
                  {sub.name}
                </h3>
                <span className="text-xs sm:text-sm text-slate-500 font-medium block truncate mt-0.5">
                  {sub.lecturer}
                </span>
              </div>

              {/* Thanh tiến độ */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700">
                  <span>Hoàn tất</span>
                  <span className="font-mono font-bold text-slate-900">{sub.rate}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      sub.rate === 100
                        ? "bg-emerald-600"
                        : sub.rate > 50
                        ? "bg-slate-900"
                        : "bg-red-600"
                    }`}
                    style={{ width: `${sub.rate}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sổ Nhiệm Vụ Cá Nhân */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Sổ nhiệm vụ cá nhân (Tự đánh dấu hoàn thành)
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Sử dụng các tab trạng thái để lọc nhanh bài tập. Bấm vào trạng thái để đánh dấu nộp bài.
            </p>
          </div>
          <span className="text-xs sm:text-sm font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
            TỰ LƯU MÁY CHỦ
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
