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

  const upcomingDeadlines = deadlines.slice(0, 6);
  const urgentCount = deadlines.filter((d) => d.priority === "high").length;

  return (
    <div className="space-y-16">
      {/* Expansive Modern Administrative Hero Section with 2-Column Balance */}
      <section className="relative rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white via-white to-slate-50/70 p-8 sm:p-12 lg:p-14 shadow-xs overflow-hidden">
        {/* Ambient Subtle Gradients */}
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
                <span>Xem Toàn Bộ Sổ Deadline ({deadlines.length})</span>
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

              {/* 4 Chỉ số học vụ dạng 2x2 */}
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
                      Cơ chế dữ liệu
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

              {/* Dòng liên kết tra cứu */}
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
                  <span>Học kỳ I • Năm học 2026 – 2027</span>
                </span>
                <Link
                  href="/deadlines"
                  className="text-red-700 hover:text-red-800 transition-colors inline-flex items-center gap-1"
                >
                  <span>Mở sổ điều hành &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BẢNG THÔNG TIN PHÒNG HÀNH CHÍNH & NIÊM YẾT HỌC VỤ (Phỏng theo Ảnh 2 - Bảng tin hành chính) */}
      <section className="space-y-6">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-red-200">
                PHÒNG HÀNH CHÍNH — TỔNG HỢP & QUẢN LÝ ĐÀO TẠO
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Bảng Thông Tin Phòng Hành Chính & Quy Chế Học Vụ
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Niêm yết các văn bản chỉ đạo học vụ, quy định thời hạn nộp bài tập,
              chuẩn định dạng file lưu trữ và lịch trực hỗ trợ sinh viên chính quy
              Học kỳ I (2026 – 2027).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Niêm yết có hiệu lực</span>
            </span>
          </div>
        </div>

        {/* 4 Văn bản thông báo niêm yết */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Thông báo 1: Quy chế nộp bài */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between relative group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-md border border-red-200/60">
                  QĐ-482/HVBCVT
                </span>
                <span className="text-[11px] font-bold text-slate-500 uppercase">
                  15/09/2026
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-red-700 transition-colors">
                Quy chế nộp bài tập & Khóa sổ điểm học phần
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                Tất cả bài tập lớn, bài thực hành và tiểu luận phải nộp đúng hạn
                trên hệ thống. Hệ thống tự động ghi nhận timestamp; bài nộp quá
                hạn phải có phê duyệt của giảng viên phụ trách.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500">
                Phòng Giáo vụ
              </span>
              <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                Bắt buộc thực hiện
              </span>
            </div>
          </div>

          {/* Thông báo 2: Định dạng file */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between relative group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/60">
                  HD-18/KCNTT
                </span>
                <span className="text-[11px] font-bold text-slate-500 uppercase">
                  20/09/2026
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-red-700 transition-colors">
                Chuẩn định dạng file lưu trữ & Cú pháp đặt tên
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                Bài nộp dạng mã nguồn nén <code className="text-slate-800 font-mono">.zip</code> hoặc báo cáo học thuật <code className="text-slate-800 font-mono">.pdf</code>.
                Đặt tên theo cú pháp: <strong className="text-slate-800">[MãSV]_[MãMôn]_[TênBài].pdf</strong>.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500">
                Khoa CNTT
              </span>
              <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                Hướng dẫn kỹ thuật
              </span>
            </div>
          </div>

          {/* Thông báo 3: Lịch trực văn phòng */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between relative group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/60">
                  TB-09/BCS
                </span>
                <span className="text-[11px] font-bold text-slate-500 uppercase">
                  Thường trực
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-red-700 transition-colors">
                Lịch tiếp sinh viên & Hỗ trợ kỹ thuật nộp bài
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                Ban cán sự lớp và trợ giảng trực hỗ trợ giải đáp thắc mắc phân
                nhóm đề tài, xác nhận hoàn thành và sửa đổi thông tin bài nộp tại
                Văn phòng P.202-A2 từ 08:00 – 17:00 các ngày trong tuần.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500">
                Ban Cán sự
              </span>
              <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                Thường trực P.202
              </span>
            </div>
          </div>

          {/* Thông báo 4: Cảnh báo ưu tiên cao */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between relative group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200/60">
                  CB-03/GV
                </span>
                <span className="text-[11px] font-bold text-rose-600 uppercase">
                  Khẩn cấp
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-red-700 transition-colors">
                Cảnh báo 5 bài tập có mức độ ưu tiên cao
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                Các bài tập có gắn cờ đỏ <strong className="text-rose-700">Ưu tiên cao</strong> chiếm trọng số điểm quá trình từ 20% – 30%. Sinh viên chú ý theo dõi đồng hồ đếm ngược và hoàn thành đúng hạn.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500">
                Bộ môn LTW / CSDL
              </span>
              <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                Ưu tiên cao (5 bài)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* BẢNG ĐIỀU HÀNH CÔNG VIỆC HỌC VỤ (Phỏng theo Ảnh 1 - Giao diện Bảng điều hành 1Office) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200/80 pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-red-700 font-mono">
                BẢNG ĐIỀU HÀNH CÔNG VIỆC HỌC VỤ (PHONG CÁCH 1OFFICE)
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 mt-1">
              Lịch nộp bài tập cận kề & Theo dõi tiến độ
            </h2>
          </div>
          <Link
            href="/deadlines"
            className="text-sm sm:text-base font-bold text-slate-800 hover:text-red-700 transition-colors inline-flex items-center gap-1.5 shrink-0"
          >
            <span>Mở toàn bộ Sổ Deadline ({deadlines.length})</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* 1Office Administrative Task Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase text-slate-600 tracking-wider">
                  <th className="py-4 px-4 w-12 text-center font-mono">#</th>
                  <th className="py-4 px-3 w-28 text-center">Ưu tiên</th>
                  <th className="py-4 px-5">Tên công việc & Bài tập</th>
                  <th className="py-4 px-4 w-44">Học phần</th>
                  <th className="py-4 px-5 w-48">Hạn chót quy định</th>
                  <th className="py-4 px-4 w-40">Thời gian còn lại</th>
                  <th className="py-4 px-4 w-36 text-center">Trạng thái</th>
                  <th className="py-4 px-4 w-28 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {upcomingDeadlines.map((item, index) => {
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/90 transition-colors"
                    >
                      <td className="py-4.5 px-4 text-center font-mono text-slate-400">
                        {index + 1}
                      </td>

                      {/* 1Office Priority Flag Icon */}
                      <td className="py-4.5 px-3 text-center whitespace-nowrap">
                        {item.priority === "high" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200/70 px-2 py-0.5 rounded-md">
                            <svg className="w-3.5 h-3.5 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                            </svg>
                            <span>Cao</span>
                          </span>
                        ) : item.priority === "medium" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-md">
                            <svg className="w-3.5 h-3.5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                            </svg>
                            <span>Thường</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                            </svg>
                            <span>Thấp</span>
                          </span>
                        )}
                      </td>

                      {/* Tên công việc & Bài tập */}
                      <td className="py-4.5 px-5">
                        <Link
                          href={`/deadlines/${item.id}`}
                          className="font-bold text-slate-900 hover:text-red-700 transition-colors block text-sm leading-snug"
                        >
                          {item.title}
                        </Link>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      </td>

                      {/* Học phần */}
                      <td className="py-4.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-slate-900 block text-xs">
                          {item.subjectName}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {item.subjectSlug.toUpperCase()}
                        </span>
                      </td>

                      {/* Hạn chót */}
                      <td className="py-4.5 px-5 whitespace-nowrap text-slate-700">
                        <span className="font-semibold block text-xs">
                          {new Date(item.dueDate).toLocaleDateString("vi-VN")}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(item.dueDate).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>

                      {/* Thời gian còn lại */}
                      <td className="py-4.5 px-4 whitespace-nowrap">
                        <Countdown dueDate={item.dueDate} />
                      </td>

                      {/* 1Office Status Pill */}
                      <td className="py-4.5 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200/70 px-2.5 py-0.5 rounded-full">
                          ● Đang thực hiện
                        </span>
                      </td>

                      {/* Thao tác */}
                      <td className="py-4.5 px-4 text-right whitespace-nowrap">
                        <Link
                          href={`/deadlines/${item.id}`}
                          className="font-bold text-slate-700 hover:text-red-700 text-xs transition-colors inline-flex items-center gap-1"
                        >
                          <span>Hồ sơ</span>
                          <span>&rarr;</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50/50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
            <span>Hiển thị 6/{deadlines.length} bài tập gần nhất theo thời gian thực</span>
            <Link
              href="/deadlines"
              className="font-bold text-red-700 hover:text-red-800 transition-colors inline-flex items-center gap-1"
            >
              <span>Xem bảng đầy đủ kèm bộ lọc nâng cao</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* DANH MỤC 4 HỌC PHẦN TRONG HỌC KỲ */}
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
    </div>
  );
}
