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

  return (
    <div className="space-y-8">
      {/* Modern Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="text-xs sm:text-sm text-slate-500 flex items-center gap-2.5"
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
        <span className="text-slate-800 font-bold">
          {subject.name} ({subject.code})
        </span>
      </nav>

      {/* Spacious Subject Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-bold font-mono bg-red-50 text-red-700 border border-red-200/70 px-3 py-1.5 rounded-lg">
              MÃ MÔN: {subject.code}
            </span>
            <span className="text-sm sm:text-base text-slate-600 font-medium flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{subject.credits} tín chỉ chính quy</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-sm text-slate-700 bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-xl">
            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
              GV
            </div>
            <span>
              Giảng viên phụ trách:{" "}
              <strong className="text-slate-900">{subject.lecturer}</strong>
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-3">
            {subject.name}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-4xl">
            {subject.description}
          </p>
        </div>
      </div>

      {/* Danh sách bài tập được giao của môn */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-3xl font-black text-slate-900">
              Danh sách bài tập & Deadline ({deadlines.length})
            </h2>
          </div>
          <Link
            href="/deadlines"
            className="text-sm font-bold text-slate-700 hover:text-red-700 transition-colors flex items-center gap-1.5"
          >
            <span>&larr;</span>
            <span>Xem tất cả môn học khác</span>
          </Link>
        </div>

        {deadlines.length === 0 ? (
          <div className="bg-white p-16 rounded-3xl border border-slate-200/80 text-center text-slate-500 text-sm">
            Hiện chưa có bài tập nào được phân công cho học phần này.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200/80 uppercase text-xs tracking-wider">
                <tr>
                  <th className="py-4 px-5 w-14 text-center">STT</th>
                  <th className="py-4 px-5">Tiêu đề bài tập & Nội dung</th>
                  <th className="py-4 px-5 w-52">Hạn chót quy định</th>
                  <th className="py-4 px-5 w-44">Tình trạng</th>
                  <th className="py-4 px-5 w-28 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deadlines.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-4.5 px-5 text-center font-mono text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-4.5 px-5">
                      <Link
                        href={`/deadlines/${item.id}`}
                        className="font-bold text-slate-900 hover:text-red-700 block leading-snug transition-colors text-base"
                      >
                        {item.title}
                      </Link>
                      <p className="text-slate-500 text-xs line-clamp-1 mt-1">
                        {item.description}
                      </p>
                    </td>
                    <td className="py-4.5 px-5 whitespace-nowrap text-slate-700">
                      <span className="font-semibold block">
                        {new Date(item.dueDate).toLocaleDateString("vi-VN")}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(item.dueDate).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="py-4.5 px-5 whitespace-nowrap">
                      <Countdown dueDate={item.dueDate} />
                    </td>
                    <td className="py-4.5 px-5 text-right whitespace-nowrap">
                      <Link
                        href={`/deadlines/${item.id}`}
                        className="font-bold text-slate-700 hover:text-red-700 transition-colors"
                      >
                        Chi tiết &rarr;
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
