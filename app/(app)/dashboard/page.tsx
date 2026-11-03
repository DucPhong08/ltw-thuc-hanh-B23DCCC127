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

  return (
    <div className="space-y-8">
      {/* Khung Thông tin Tiến độ Cá nhân — Spacious Dashboard Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200/70 px-3 py-1 rounded-full font-mono">
                DASHBOARD SSR
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Tiến độ học tập cá nhân
              </h1>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Sinh viên:{" "}
              <strong className="text-slate-900">
                {session.user.name || session.user.email}
              </strong>{" "}
              • Dữ liệu tính toán máy chủ thời gian thực
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block font-medium">
              Vai trò tài khoản:
            </span>
            <span
              className={`inline-block text-xs uppercase font-bold px-3 py-1 rounded-full border mt-1 ${
                session.user.role === "admin"
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }`}
            >
              {session.user.role === "admin"
                ? "Ban cán sự lớp"
                : "Sinh viên chính quy"}
            </span>
          </div>
        </div>

        {/* Thanh tiến độ hoàn thành */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm font-bold text-slate-700">
            <span>Tiến độ hoàn thành nghĩa vụ học phần:</span>
            <span className="font-mono text-slate-900 text-base">
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

        {/* 4 Thẻ chỉ số */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-1">
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/70">
            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block mb-1">
              Tổng số bài
            </span>
            <span className="text-3xl font-black text-slate-900 tabular-nums">
              {deadlines.length}
            </span>
            <span className="text-xs text-slate-400 block mt-1">
              toàn học kỳ
            </span>
          </div>

          <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-200/70">
            <span className="text-xs text-emerald-800 uppercase font-bold tracking-wider block mb-1">
              Đã hoàn thành
            </span>
            <span className="text-3xl font-black text-emerald-700 tabular-nums">
              {completedCount}
            </span>
            <span className="text-xs text-emerald-600 block mt-1 font-medium">
              đã xác nhận nộp
            </span>
          </div>

          <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-200/70">
            <span className="text-xs text-amber-800 uppercase font-bold tracking-wider block mb-1">
              Chưa hoàn thành
            </span>
            <span className="text-3xl font-black text-amber-700 tabular-nums">
              {pendingCount}
            </span>
            <span className="text-xs text-amber-600 block mt-1 font-medium">
              nhiệm vụ còn lại
            </span>
          </div>

          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/70">
            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block mb-1">
              Tỷ lệ đạt
            </span>
            <span className="text-3xl font-black text-slate-900 tabular-nums">
              {completionRate}%
            </span>
            <span className="text-xs text-slate-400 block mt-1 font-medium">
              theo tiến độ
            </span>
          </div>
        </div>
      </div>

      {/* Sổ Deadline cá nhân */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Sổ nhiệm vụ cá nhân (Tự đánh dấu hoàn thành)
          </h2>
          <span className="text-xs sm:text-sm text-slate-500 font-medium">
            Tự động lưu theo tài khoản
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
