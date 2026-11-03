import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getDeadlinesBySubject,
  getSubjectBySlug,
  getSubjects,
} from "@/lib/data";
import { Countdown } from "@/components/countdown";

interface SubjectPageProps {
  params: Promise<{ slug: string }>;
}

// Bắt buộc SSG (Static Site Generation) và sinh sẵn tĩnh 4 môn học lúc build
export const dynamicParams = false;

export async function generateStaticParams() {
  const subjects = await getSubjects();
  return subjects.map((sub) => ({
    slug: sub.slug,
  }));
}

export async function generateMetadata({
  params,
}: SubjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);
  if (!subject) return { title: "Không tìm thấy học phần" };

  return {
    title: `Học phần: ${subject.name} (${subject.code}) — PTIT Deadline Hub`,
    description: subject.description,
  };
}

export default async function SubjectDetailPage({ params }: SubjectPageProps) {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);

  if (!subject) {
    notFound();
  }

  const deadlines = await getDeadlinesBySubject(slug);
  const urgentCount = deadlines.filter((d) => d.priority === "high").length;

  return (
    <div className="space-y-8">
      {/* Breadcrumb Định hướng Thân thiện */}
      <nav
        aria-label="Breadcrumb"
        className="text-sm font-semibold text-slate-500 flex items-center gap-2.5"
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
        <span className="text-slate-900 font-bold">
          {subject.name} ({subject.code})
        </span>
      </nav>

      {/* Hồ sơ Học phần Chính quy */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-bold font-mono bg-slate-100 text-slate-900 border border-slate-200 px-3.5 py-1.5 rounded-lg">
              MÃ MÔN: {subject.code}
            </span>
            <span className="text-sm sm:text-base text-slate-700 font-bold">
              {subject.credits} tín chỉ chính quy
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs sm:text-sm text-slate-600 font-medium">
              Đánh giá: 40% Quá trình — 60% Thi
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-sm sm:text-base text-slate-800 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
            <span className="text-slate-500 font-medium">Giảng viên:</span>
            <strong className="text-slate-900 font-bold">{subject.lecturer}</strong>
          </div>
        </div>

        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            {subject.name}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-4xl">
            {subject.description}
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-4 text-sm font-semibold">
          <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
            Tổng cộng: {deadlines.length} bài tập
          </span>
          {urgentCount > 0 && (
            <span className="px-3.5 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-200">
              {urgentCount} bài ưu tiên cao
            </span>
          )}
        </div>
      </div>

      {/* Danh sách bài tập được giao của môn */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <div>
            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-red-700">
              SỔ THEO DÕI HỌC PHẦN
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
              Nhiệm vụ & Hạn nộp bài tập ({deadlines.length})
            </h2>
          </div>
          <Link
            href="/deadlines"
            className="text-base font-bold text-red-700 hover:text-red-800 transition-colors flex items-center gap-1.5"
          >
            <span>&larr;</span>
            <span>Xem tất cả học phần</span>
          </Link>
        </div>

        {deadlines.length === 0 ? (
          <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center text-slate-600 text-base shadow-xs">
            Hiện chưa có bài tập nào được phân công cho học phần này.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-base">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-xs sm:text-sm tracking-wider">
                <tr>
                  <th className="py-4.5 px-5 w-14 text-center font-mono">STT</th>
                  <th className="py-4.5 px-4 w-32 text-center">Ưu tiên</th>
                  <th className="py-4.5 px-6">Tiêu đề bài tập & Nội dung</th>
                  <th className="py-4.5 px-6 w-52">Hạn chót quy định</th>
                  <th className="py-4.5 px-5 w-44">Thời gian còn lại</th>
                  <th className="py-4.5 px-5 w-32 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deadlines.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-5 px-5 text-center font-mono text-sm font-bold text-slate-400">
                      {idx + 1}
                    </td>

                    {/* Mức độ ưu tiên */}
                    <td className="py-5 px-4 text-center whitespace-nowrap">
                      {item.priority === "high" ? (
                        <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-lg">
                          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                          </svg>
                          <span>Cao</span>
                        </span>
                      ) : item.priority === "medium" ? (
                        <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg">
                          <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                          </svg>
                          <span>Thường</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg">
                          <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                          </svg>
                          <span>Thấp</span>
                        </span>
                      )}
                    </td>

                    {/* Tiêu đề & Mô tả */}
                    <td className="py-5 px-6">
                      <Link
                        href={`/deadlines/${item.id}`}
                        className="font-bold text-slate-900 hover:text-red-700 block leading-snug transition-colors text-base sm:text-lg"
                      >
                        {item.title}
                      </Link>
                      <p className="text-slate-600 text-sm line-clamp-1 mt-1">
                        {item.description}
                      </p>
                    </td>

                    {/* Hạn chót */}
                    <td className="py-5 px-6 whitespace-nowrap text-slate-800">
                      <span className="font-bold block text-sm sm:text-base">
                        {new Date(item.dueDate).toLocaleDateString("vi-VN")}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-500 font-mono mt-0.5 block">
                        {new Date(item.dueDate).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>

                    {/* Thời gian còn lại */}
                    <td className="py-5 px-5 whitespace-nowrap">
                      <Countdown dueDate={item.dueDate} />
                    </td>

                    {/* Chi tiết */}
                    <td className="py-5 px-5 text-right whitespace-nowrap">
                      <Link
                        href={`/deadlines/${item.id}`}
                        className="font-bold text-red-700 hover:text-red-800 transition-colors text-sm sm:text-base inline-flex items-center gap-1"
                      >
                        <span>Hồ sơ</span>
                        <span>&rarr;</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
