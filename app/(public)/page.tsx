import Link from "next/link";
import { getDeadlines, getSubjects } from "@/lib/data";
import { Countdown } from "@/components/countdown";

// Chiến lược SSG (Static Site Generation) bắt buộc theo đề bài
export const dynamic = "force-static";

export default async function HomePage() {
  const [subjects, deadlines] = await Promise.all([
    getSubjects(),
    getDeadlines(),
  ]);

  const upcomingDeadlines = deadlines.slice(0, 4);
  const urgentCount = deadlines.filter((d) => d.priority === "high").length;

  return (
    <div className="space-y-16">
      {/* Expansive Modern Administrative Hero Section with 2-Column Balance */}
      <section className="relative rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white via-white to-slate-50/70 p-8 sm:p-12 lg:p-14 shadow-xs overflow-hidden">
        {/* Subtle Ambient Decorative Gradients */}
        <div
          className="absolute top-0 right-0 -mt-20 -mr-20 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-1/4 -mb-20 w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
          {/* Left Column: Hero Title & Quick Actions */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-red-50 text-red-700 border border-red-200/70 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span>
                Cổng thông tin học vụ chính thức • Học kỳ I (2026 – 2027)
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight text-slate-900 leading-[1.14] text-balance">
              Quản lý Tiến độ & Hạn nộp Bài tập
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed text-pretty max-w-2xl">
              Hệ thống tra cứu thời hạn nộp bài tập, đồ án chuyên ngành và theo
              dõi tiến độ hoàn thành nghĩa vụ học tập theo thời gian thực dành
              cho sinh viên Học viện Công nghệ Bưu chính Viễn thông.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/deadlines"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
              >
                <span>Xem Sổ Deadline ({deadlines.length})</span>
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
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-2xl border border-slate-200/90 shadow-2xs transition-all active:scale-[0.99]"
              >
                <span>Đăng nhập sinh viên</span>
              </Link>
            </div>
          </div>

          {/* Right Column ("Góc kia"): Thống kê học vụ đơn giản, văn minh hành chính */}
          <div className="lg:col-span-5 xl:col-span-5">
            <div className="bg-slate-50/90 rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Tổng quan Học vụ • Kỳ I
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Đang mở
                </span>
              </div>

              {/* 4 Chỉ số học vụ dạng 2x2 gọn gàng, thanh lịch */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span className="font-semibold uppercase text-[11px] tracking-wide">
                      Học phần
                    </span>
                    <div className="w-6 h-6 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
                    {subjects.length}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    môn chính thức
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span className="font-semibold uppercase text-[11px] tracking-wide">
                      Tổng Deadline
                    </span>
                    <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <svg
                        className="w-3.5 h-3.5"
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
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
                    {deadlines.length}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    nhiệm vụ học tập
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span className="font-semibold uppercase text-[11px] tracking-wide">
                      Ưu tiên cao
                    </span>
                    <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-rose-600 tabular-nums">
                    {urgentCount}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    bài tập bắt buộc
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span className="font-semibold uppercase text-[11px] tracking-wide">
                      Cập nhật
                    </span>
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                    ISR (60s)
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    Core Web Vitals
                  </div>
                </div>
              </div>

              {/* Thông báo tiến độ học vụ hành chính */}
              <div className="pt-2 flex items-center justify-between text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5 text-slate-500">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Học kỳ I • 2026 – 2027</span>
                </span>
                <Link
                  href="/deadlines"
                  className="text-red-700 hover:text-red-800 transition-colors inline-flex items-center gap-1"
                >
                  <span>Tra cứu hạn nộp &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Danh mục 4 Học phần — Card to, thoáng, typography rõ ràng */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-slate-200/80 pb-4">
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-red-700">
              Chương trình đào tạo
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 mt-1">
              Các học phần trong kỳ
            </h2>
          </div>
          <span className="text-xs sm:text-sm text-slate-500 hidden sm:inline font-medium">
            Khoa Công nghệ Thông tin • PTIT
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {subjects.map((sub) => {
            const count = deadlines.filter(
              (d) => d.subjectSlug === sub.slug,
            ).length;
            return (
              <Link
                key={sub.slug}
                href={`/subjects/${sub.slug}`}
                className="group relative bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs sm:text-sm mb-4">
                    <span className="font-mono text-xs sm:text-sm font-bold px-3 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200/70">
                      {sub.code}
                    </span>
                    <span className="text-slate-500 font-medium">
                      {sub.credits} tín chỉ
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg sm:text-xl mb-3 group-hover:text-red-700 transition-colors leading-snug">
                    {sub.name}
                  </h3>

                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-6">
                    {sub.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium truncate pr-2">
                    {sub.lecturer}
                  </span>
                  <span className="font-bold text-slate-900 group-hover:text-red-700 group-hover:translate-x-1 transition-all flex items-center gap-1.5 shrink-0">
                    <span>{count} bài</span>
                    <span>&rarr;</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Lịch nộp bài tập cận kề */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-slate-200/80 pb-4">
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-rose-700">
              Nhắc nhở thời hạn
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 mt-1">
              Lịch nộp bài tập cận kề
            </h2>
          </div>
          <Link
            href="/deadlines"
            className="text-sm sm:text-base font-bold text-slate-800 hover:text-red-700 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Xem toàn bộ ({deadlines.length})</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {upcomingDeadlines.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-200 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between text-xs sm:text-sm mb-4">
                  <span className="font-bold text-slate-700 text-xs bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/60">
                    {item.subjectName}
                  </span>
                  <span className="text-xs uppercase font-extrabold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                    {item.priority}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-3 leading-snug">
                  <Link
                    href={`/deadlines/${item.id}`}
                    className="hover:text-red-700 transition-colors"
                  >
                    {item.title}
                  </Link>
                </h3>

                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Countdown dueDate={item.dueDate} />
                <Link
                  href={`/deadlines/${item.id}`}
                  className="text-sm font-bold text-slate-700 hover:text-red-700 transition-colors"
                >
                  Chi tiết &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
