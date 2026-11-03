import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { getDeadlineById, getDeadlines } from "@/lib/data";
import { Countdown } from "@/components/countdown";
import { DeadlineDetailAction } from "@/components/deadline-detail-action";
import { JsonLdBreadcrumb } from "@/components/json-ld";

interface DeadlineDetailProps {
  params: Promise<{ id: string }>;
}

// Chiến lược ISR: Sinh trước các deadline đã có; làm mới on-demand khi admin thêm/xoá
export async function generateStaticParams() {
  const deadlines = await getDeadlines();
  return deadlines.map((item) => ({
    id: item.id,
  }));
}

export async function generateMetadata({
  params,
}: DeadlineDetailProps): Promise<Metadata> {
  const { id } = await params;
  const deadline = await getDeadlineById(id);

  if (!deadline) {
    return { title: "Không tìm thấy hồ sơ bài tập" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    title: `${deadline.title} — Học phần ${deadline.subjectName}`,
    description: deadline.description,
    openGraph: {
      title: `${deadline.title} | Học viện Công nghệ Bưu chính Viễn thông`,
      description: `Hạn nộp quy định: ${new Date(
        deadline.dueDate,
      ).toLocaleDateString("vi-VN")} — ${deadline.description}`,
      type: "article",
      url: `${baseUrl}/deadlines/${deadline.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: deadline.title,
      description: deadline.description,
    },
  };
}

export default async function DeadlineDetailPage({
  params,
}: DeadlineDetailProps) {
  const { id } = await params;
  const deadline = await getDeadlineById(id);

  if (!deadline) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const breadcrumbItems = [
    { name: "Trang chủ", item: `${baseUrl}/` },
    { name: "Sổ theo dõi Deadline", item: `${baseUrl}/deadlines` },
    {
      name: deadline.subjectName,
      item: `${baseUrl}/subjects/${deadline.subjectSlug}`,
    },
    { name: deadline.title, item: `${baseUrl}/deadlines/${deadline.id}` },
  ];

  return (
    <article className="max-w-5xl lg:max-w-6xl mx-auto space-y-8">
      {/* Schema JSON-LD BreadcrumbList cho SEO */}
      <JsonLdBreadcrumb items={breadcrumbItems} />

      {/* Modern Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="text-xs sm:text-sm text-slate-500 flex flex-wrap items-center gap-2.5"
      >
        <Link
          href="/"
          className="hover:text-slate-900 transition-colors flex items-center gap-1.5 font-medium"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span>Trang chủ</span>
        </Link>
        <span className="text-slate-300">/</span>
        <Link
          href="/deadlines"
          className="hover:text-slate-900 transition-colors font-medium"
        >
          Sổ Deadline
        </Link>
        <span className="text-slate-300">/</span>
        <Link
          href={`/subjects/${deadline.subjectSlug}`}
          className="hover:text-slate-900 transition-colors font-medium"
        >
          {deadline.subjectName}
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-800 font-bold truncate max-w-xs font-mono">
          #{deadline.id}
        </span>
      </nav>

      {/* Modern Administrative Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-xs space-y-8">
        <div className="border-b border-slate-100 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-slate-800 bg-slate-100 border border-slate-200/80 px-3 py-1 rounded-lg">
              MÃ BÀI TẬP #{deadline.id}
            </span>
            <span className="text-sm sm:text-base text-slate-600 font-medium">
              Học phần:{" "}
              <strong className="text-slate-900">{deadline.subjectName}</strong>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-5 leading-tight">
            {deadline.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              <Countdown dueDate={deadline.dueDate} />
              <span className="text-xs font-bold text-slate-700 uppercase bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                Mức độ: {deadline.priority}
              </span>
            </div>

            <Suspense
              fallback={
                <div className="h-10 w-32 bg-slate-100 rounded-xl animate-pulse" />
              }
            >
              <DeadlineDetailAction deadlineId={deadline.id} />
            </Suspense>
          </div>
        </div>

        {/* 3 Thông số thời hạn */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-50/80 p-6 sm:p-8 rounded-2xl border border-slate-200/80 text-sm">
          <div>
            <span className="text-slate-500 text-xs block uppercase font-bold tracking-wider">
              Hạn chót nộp bài:
            </span>
            <strong className="text-slate-900 text-base sm:text-lg block mt-1 font-bold">
              {new Date(deadline.dueDate).toLocaleString("vi-VN", {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </strong>
          </div>

          <div>
            <span className="text-slate-500 text-xs block uppercase font-bold tracking-wider">
              Ngày ban hành:
            </span>
            <strong className="text-slate-900 text-base sm:text-lg block mt-1 font-bold">
              {new Date(deadline.createdAt).toLocaleDateString("vi-VN")}
            </strong>
          </div>

          <div>
            <span className="text-slate-500 text-xs block uppercase font-bold tracking-wider">
              Bộ môn phụ trách:
            </span>
            <strong className="text-slate-900 text-base sm:text-lg block mt-1 font-bold">
              Khoa CNTT — {deadline.subjectName}
            </strong>
          </div>
        </div>

        {/* Nội dung chi tiết */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Nội dung yêu cầu bài tập & Quy chuẩn nghiệm thu
          </h2>
          <div className="text-base text-slate-700 leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 whitespace-pre-line font-sans">
            {deadline.description}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-sm font-bold">
          <Link
            href="/deadlines"
            className="text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5"
          >
            <span>&larr;</span>
            <span>Quay lại sổ theo dõi Deadline</span>
          </Link>

          <Link
            href={`/subjects/${deadline.subjectSlug}`}
            className="text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Xem tất cả bài tập môn {deadline.subjectName}</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
