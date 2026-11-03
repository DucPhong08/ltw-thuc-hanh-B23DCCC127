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

      {/* Breadcrumb Định hướng Thân thiện */}
      <nav
        aria-label="Breadcrumb"
        className="text-sm font-semibold text-slate-500 flex flex-wrap items-center gap-2.5"
      >
        <Link
          href="/"
          className="hover:text-slate-900 transition-colors flex items-center gap-1.5"
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
          className="hover:text-slate-900 transition-colors"
        >
          Sổ Deadline
        </Link>
        <span className="text-slate-300">/</span>
        <Link
          href={`/subjects/${deadline.subjectSlug}`}
          className="hover:text-slate-900 transition-colors"
        >
          {deadline.subjectName}
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 font-bold truncate max-w-xs font-mono">
          #{deadline.id}
        </span>
      </nav>

      {/* HỒ SƠ HỌC VỤ CHÍNH THỨC (OFFICIAL ACADEMIC DOSSIER) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8">
        {/* Header Hồ Sơ */}
        <div className="border-b border-slate-200 pb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-slate-800 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-lg">
                HỒ SƠ HỌC VỤ #{deadline.id}
              </span>
              <span className="text-sm font-bold text-slate-600">
                Môn: <strong className="text-slate-900">{deadline.subjectName}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {deadline.priority === "high" ? (
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-red-700 bg-red-50 border border-red-200 px-3.5 py-1.5 rounded-full">
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                  </svg>
                  <span>Ưu tiên cao (Bắt buộc)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full">
                  <span>Mức độ thường</span>
                </span>
              )}
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {deadline.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              <Countdown dueDate={deadline.dueDate} />
              <span className="text-xs sm:text-sm font-semibold text-slate-500">
                Học kỳ I • Năm học 2026 – 2027
              </span>
            </div>

            <Suspense
              fallback={
                <div className="h-11 w-36 bg-slate-100 rounded-xl animate-pulse" />
              }
            >
              <DeadlineDetailAction deadlineId={deadline.id} />
            </Suspense>
          </div>
        </div>

        {/* 4 Chỉ số Hành chính */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">
              Hạn chót nộp bài
            </span>
            <strong className="text-slate-900 text-base sm:text-lg font-black block">
              {new Date(deadline.dueDate).toLocaleDateString("vi-VN")}
            </strong>
            <span className="text-xs font-mono font-bold text-slate-500 block">
              {new Date(deadline.dueDate).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })} (UTC+7)
            </span>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">
              Hình thức nghiệm thu
            </span>
            <strong className="text-slate-900 text-base sm:text-lg font-black block">
              Nộp trực tuyến
            </strong>
            <span className="text-xs text-slate-600 font-medium block">
              Lưu timestamp máy chủ
            </span>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">
              Chuẩn định dạng file
            </span>
            <strong className="text-slate-900 text-base sm:text-lg font-mono font-bold block">
              .ZIP / .PDF
            </strong>
            <span className="text-xs text-slate-600 font-medium block">
              [MãSV]_[MãMôn]_[TênBài]
            </span>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-xs text-red-700 uppercase font-bold tracking-wider block">
              Trọng số đánh giá
            </span>
            <strong className="text-red-700 text-base sm:text-lg font-black block">
              {deadline.priority === "high" ? "20% - 30%" : "10% - 15%"}
            </strong>
            <span className="text-xs text-slate-600 font-medium block">
              Điểm thành phần quá trình
            </span>
          </div>
        </div>

        {/* Nội dung chi tiết & Yêu cầu kỹ thuật */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-slate-800">
              Yêu cầu nhiệm vụ & Tiêu chuẩn nghiệm thu
            </h2>
          </div>
          <div className="text-base sm:text-lg text-slate-700 leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 whitespace-pre-line font-sans">
            {deadline.description}
          </div>
        </div>

        {/* Khung Quy định nộp bài & Xử lý trễ hạn */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-3">
          <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-800">
            Quy định nộp bài & Chính sách thời gian ân hạn
          </h3>
          <ul className="text-sm sm:text-base text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
            <li>
              <strong>Nộp trước 23:59 ngày quy định:</strong> Hệ thống tự động ghi nhận đạt chuẩn 100% thời hạn.
            </li>
            <li>
              <strong>Thời gian ân hạn (trễ dưới 24h):</strong> Hệ thống cho phép nộp bù nhưng áp dụng trừ 10% điểm quá trình theo Quy định đào tạo số 482/HVBCVT.
            </li>
            <li>
              <strong>Quá hạn trên 48h:</strong> Cổng nộp bài trực tuyến tự động đóng; sinh viên phải làm đơn giải trình có xác nhận của Cố vấn học tập hoặc Giảng viên phụ trách.
            </li>
          </ul>
        </div>

        {/* Điều hướng chân trang */}
        <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-base font-bold">
          <Link
            href="/deadlines"
            className="text-slate-700 hover:text-red-700 transition-colors inline-flex items-center gap-2"
          >
            <span>&larr;</span>
            <span>Quay lại sổ theo dõi Deadline</span>
          </Link>

          <Link
            href={`/subjects/${deadline.subjectSlug}`}
            className="text-red-700 hover:text-red-800 transition-colors inline-flex items-center gap-2"
          >
            <span>Xem tất cả bài tập môn {deadline.subjectName}</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
