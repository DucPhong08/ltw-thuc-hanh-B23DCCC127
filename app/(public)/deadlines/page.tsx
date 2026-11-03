import type { Metadata } from "next";
import { Suspense } from "react";
import { getDeadlines, getSubjects } from "@/lib/data";
import { DeadlinesContent } from "@/components/deadlines-content";

// Chiến lược ISR (Incremental Static Regeneration): Làm mới lại sau mỗi 60 giây
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Sổ Theo Dõi Deadline — Học viện Công nghệ Bưu chính Viễn thông",
  description:
    "Danh sách toàn bộ bài tập và hạn nộp của các môn học trong kỳ. Cập nhật ISR tự động mỗi 60 giây.",
};

export default async function DeadlinesPage() {
  const [subjects, deadlines] = await Promise.all([
    getSubjects(),
    getDeadlines(),
  ]);

  return (
    <div className="space-y-8">
      {/* Spacious Banner Header */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-bold uppercase bg-red-50 text-red-700 border border-red-200/70 px-3 py-1 rounded-md">
              CƠ CHẾ ISR (60S)
            </span>
            <span className="text-xs sm:text-sm text-slate-500 font-medium">
              Cập nhật dữ liệu thời gian thực
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
            Sổ Theo Dõi Bài Tập & Deadline
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-3xl leading-relaxed">
            Tổng hợp dữ liệu bài tập và hạn nộp chính thức của tất cả các môn
            học trong kỳ. Tự động cập nhật ngầm sau mỗi 60 giây.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start lg:self-auto text-sm text-slate-600 bg-slate-50 border border-slate-200/80 px-5 py-3 rounded-2xl font-medium shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            Tổng số:{" "}
            <strong className="text-slate-900 font-bold">
              {deadlines.length} bài tập
            </strong>
          </span>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="p-16 text-center text-slate-500 text-sm bg-white rounded-3xl border border-slate-200/80">
            Đang tải dữ liệu sổ học vụ…
          </div>
        }
      >
        <DeadlinesContent deadlines={deadlines} subjects={subjects} />
      </Suspense>
    </div>
  );
}
