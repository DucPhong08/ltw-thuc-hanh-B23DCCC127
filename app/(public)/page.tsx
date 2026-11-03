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
    <div className="space-y-14 sm:space-y-16">
      {/* Hero Section — Rõ ràng, thoáng đãng, phân cấp thị giác chuẩn mực */}
      <section className="relative rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 lg:p-14 shadow-xs overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Cột trái: Tiêu đề & Giới thiệu */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-red-50 text-red-700 border border-red-200">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span>Học viện Công nghệ Bưu chính Viễn thông • Học kỳ I (2026 – 2027)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.16]">
              Quản lý Tiến độ & Hạn nộp Bài tập
            </h1>

            <p className="text-slate-600 text-base sm:text-xl leading-relaxed max-w-2xl">
              Hệ thống tra cứu thời hạn nộp bài tập, đồ án chuyên ngành và theo
              dõi tiến độ hoàn thành nghĩa vụ học tập theo thời gian thực dành
              cho sinh viên chính quy.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/deadlines"
                className="inline-flex items-center gap-2.5 px-7 py-4 bg-slate-900 hover:bg-slate-800 text-white text-base font-bold rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
              >
                <span>Xem Toàn Bộ Sổ Deadline ({deadlines.length})</span>
                <svg
                  className="w-4 h-4 text-slate-300"
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
                className="inline-flex items-center gap-2 px-7 py-4 bg-white hover:bg-slate-50 text-slate-800 text-base font-bold rounded-2xl border border-slate-300 shadow-2xs transition-all active:scale-[0.99]"
              >
                <span>Đăng nhập sinh viên</span>
              </Link>
            </div>
          </div>

          {/* Cột phải: Khung Thống kê Học vụ Đồng bộ — Màu sắc nhã nhặn, chữ to rõ */}
          <div className="lg:col-span-5">
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-red-600" />
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-800">
                    Tổng quan Học kỳ I
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Đang mở nhận bài
                </span>
              </div>

              {/* 4 Thẻ chỉ số — Nền trắng đồng bộ, typography rõ ràng */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Học phần
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums">
                    {subjects.length}
                  </div>
                  <span className="text-xs sm:text-sm text-slate-600 font-medium mt-1 block">
                    môn chính thức
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Tổng Deadline
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums">
                    {deadlines.length}
                  </div>
                  <span className="text-xs sm:text-sm text-slate-600 font-medium mt-1 block">
                    nhiệm vụ học kỳ
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-red-700 block mb-1">
                    Ưu tiên cao
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-red-700 tabular-nums">
                    {urgentCount}
                  </div>
                  <span className="text-xs sm:text-sm text-red-700 font-semibold mt-1 block">
                    bài tập bắt buộc
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Tần suất làm mới
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                    60 giây
                  </div>
                  <span className="text-xs sm:text-sm text-slate-600 font-medium mt-1 block">
                    cơ chế ISR Next.js
                  </span>
                </div>
              </div>

              {/* Dòng điều hướng */}
              <div className="pt-2 flex items-center justify-between text-sm font-semibold text-slate-600">
                <span>Năm học 2026 – 2027</span>
                <Link
                  href="/deadlines"
                  className="text-red-700 hover:text-red-800 transition-colors inline-flex items-center gap-1 font-bold"
                >
                  <span>Mở Sổ Theo Dõi &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BẢNG THÔNG TIN PHÒNG HÀNH CHÍNH & QUY CHẾ ĐÀO TẠO — Thiết kế đồng nhất, trang nhã */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-5 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-red-700 font-mono">
                PHÒNG HÀNH CHÍNH & QUẢN LÝ ĐÀO TẠO
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
              Bảng Thông Tin Phòng Hành Chính & Quy Chế Học Vụ
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-3xl mt-1.5 leading-relaxed">
              Niêm yết các văn bản chỉ đạo học vụ, quy định thời hạn nộp bài tập,
              chuẩn định dạng file lưu trữ và lịch trực hỗ trợ sinh viên chính quy.
            </p>
          </div>

          <div className="shrink-0">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-slate-100 text-slate-800 border border-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Văn bản niêm yết có hiệu lực</span>
            </span>
          </div>
        </div>

        {/* 4 Thẻ Văn Bản Hành Chính — Đồng bộ màu sắc, typography to rõ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Văn bản 1: Quy chế nộp bài */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs sm:text-sm font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                  QĐ-482/HVBCVT
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-500">
                  15/09/2026
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-lg leading-snug">
                Quy chế nộp bài tập & Khóa sổ điểm học phần
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Tất cả bài tập lớn, bài thực hành và tiểu luận phải nộp đúng hạn
                trên hệ thống. Hệ thống tự động ghi nhận timestamp; bài nộp quá
                hạn phải có xác nhận của giảng viên phụ trách.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-medium">
              <span className="text-slate-600 font-semibold">Phòng Giáo vụ</span>
              <span className="font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
                Bắt buộc
              </span>
            </div>
          </div>

          {/* Văn bản 2: Định dạng file */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs sm:text-sm font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                  HD-18/KCNTT
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-500">
                  20/09/2026
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-lg leading-snug">
                Chuẩn định dạng file lưu trữ & Cú pháp đặt tên
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Bài nộp dạng mã nguồn nén <code className="text-slate-900 font-mono font-semibold">.zip</code> hoặc báo cáo học thuật <code className="text-slate-900 font-mono font-semibold">.pdf</code>.
                Đặt tên theo cú pháp: <strong className="text-slate-900 font-semibold">[MãSV]_[MãMôn]_[TênBài].pdf</strong>.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-medium">
              <span className="text-slate-600 font-semibold">Khoa CNTT</span>
              <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                Hướng dẫn
              </span>
            </div>
          </div>

          {/* Văn bản 3: Lịch tiếp sinh viên */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs sm:text-sm font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                  TB-09/BCS
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-500">
                  Thường trực
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-lg leading-snug">
                Lịch tiếp sinh viên & Hỗ trợ kỹ thuật nộp bài
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Ban cán sự lớp và trợ giảng trực hỗ trợ giải đáp thắc mắc phân
                nhóm đề tài, xác nhận hoàn thành và phúc khảo bài nộp tại
                Văn phòng P.202-A2 từ 08:00 – 17:00 các ngày trong tuần.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-medium">
              <span className="text-slate-600 font-semibold">Ban Cán sự</span>
              <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                P.202-A2
              </span>
            </div>
          </div>

          {/* Văn bản 4: Cảnh báo ưu tiên cao */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs sm:text-sm font-bold text-red-700 bg-red-50 px-3 py-1 rounded-lg border border-red-200">
                  CB-03/GV
                </span>
                <span className="text-xs sm:text-sm font-bold text-red-700">
                  Khẩn cấp
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-lg leading-snug">
                Cảnh báo 5 bài tập có mức độ ưu tiên cao
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Các bài tập có gắn cờ đỏ <strong className="text-red-700 font-bold">Ưu tiên cao</strong> chiếm trọng số điểm quá trình từ 20% – 30%. Sinh viên chú ý theo dõi đồng hồ đếm ngược và hoàn thành đúng hạn.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-medium">
              <span className="text-slate-600 font-semibold">Bộ môn LTW / CSDL</span>
              <span className="font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
                5 bài bắt buộc
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* BẢNG ĐIỀU HÀNH HẠN NỘP BÀI TẬP — Typography to rõ, không màu mè rối mắt */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 pb-5 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-red-700 font-mono">
                THEO DÕI HẠN NỘP BÀI TẬP
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
              Lịch nộp bài tập cận kề & Tiến độ học vụ
            </h2>
          </div>

          <Link
            href="/deadlines"
            className="text-base font-bold text-red-700 hover:text-red-800 transition-colors inline-flex items-center gap-1.5 shrink-0"
          >
            <span>Mở toàn bộ Sổ Deadline ({deadlines.length} bài)</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* Bảng Dữ Liệu Học Vụ — Thoáng đãng, cỡ chữ to rõ */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-base">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs sm:text-sm font-bold uppercase text-slate-700 tracking-wider">
                  <th className="py-4.5 px-5 w-14 text-center font-mono">#</th>
                  <th className="py-4.5 px-4 w-32 text-center">Ưu tiên</th>
                  <th className="py-4.5 px-6">Tên công việc & Bài tập</th>
                  <th className="py-4.5 px-5 w-52">Học phần</th>
                  <th className="py-4.5 px-6 w-52">Hạn chót quy định</th>
                  <th className="py-4.5 px-5 w-44">Thời gian còn lại</th>
                  <th className="py-4.5 px-5 w-40 text-center">Trạng thái</th>
                  <th className="py-4.5 px-5 w-32 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {upcomingDeadlines.map((item, index) => {
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-5 px-5 text-center font-mono text-sm font-bold text-slate-400">
                        {index + 1}
                      </td>

                      {/* Mức độ ưu tiên — Cờ chuẩn mực */}
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

                      {/* Tiêu đề bài tập & mô tả ngắn */}
                      <td className="py-5 px-6">
                        <Link
                          href={`/deadlines/${item.id}`}
                          className="font-bold text-slate-900 hover:text-red-700 transition-colors block text-base sm:text-lg leading-snug"
                        >
                          {item.title}
                        </Link>
                        <p className="text-sm text-slate-600 line-clamp-1 mt-1">
                          {item.description}
                        </p>
                      </td>

                      {/* Học phần */}
                      <td className="py-5 px-5 whitespace-nowrap">
                        <span className="font-bold text-slate-900 block text-sm sm:text-base">
                          {item.subjectName}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500 mt-0.5 block">
                          {item.subjectSlug.toUpperCase()}
                        </span>
                      </td>

                      {/* Hạn chót quy định */}
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

                      {/* Trạng thái — Pill nhã nhặn */}
                      <td className="py-5 px-5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3.5 py-1 rounded-full">
                          ● Đang thực hiện
                        </span>
                      </td>

                      {/* Thao tác */}
                      <td className="py-5 px-5 text-right whitespace-nowrap">
                        <Link
                          href={`/deadlines/${item.id}`}
                          className="font-bold text-red-700 hover:text-red-800 text-sm sm:text-base transition-colors inline-flex items-center gap-1.5"
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

          <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-slate-600">
            <span>Hiển thị 6 bài tập cận kề nhất trong tổng số <strong>{deadlines.length} bài tập</strong></span>
            <Link
              href="/deadlines"
              className="font-bold text-red-700 hover:text-red-800 transition-colors inline-flex items-center gap-1"
            >
              <span>Mở bảng đầy đủ kèm bộ lọc tìm kiếm</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* DANH MỤC 4 HỌC PHẦN TRONG HỌC KỲ */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-slate-200 pb-5">
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-red-700">
              CHƯƠNG TRÌNH ĐÀO TẠO CHÍNH QUY
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 mt-1">
              Các học phần trong kỳ
            </h2>
          </div>
          <span className="text-sm text-slate-500 hidden sm:inline font-semibold">
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
                className="group relative bg-white rounded-3xl border border-slate-200 p-7 sm:p-8 shadow-xs hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs sm:text-sm font-bold px-3 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                      {sub.code}
                    </span>
                    <span className="text-sm text-slate-600 font-semibold">
                      {sub.credits} tín chỉ
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 text-xl sm:text-2xl group-hover:text-red-700 transition-colors leading-snug">
                    {sub.name}
                  </h3>

                  <p className="text-base text-slate-600 line-clamp-3 leading-relaxed">
                    {sub.description}
                  </p>
                </div>

                <div className="pt-5 border-t border-slate-100 flex items-center justify-between text-base">
                  <span className="text-slate-600 font-medium truncate pr-2">
                    {sub.lecturer}
                  </span>
                  <span className="font-bold text-red-700 group-hover:translate-x-1 transition-all flex items-center gap-1.5 shrink-0">
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
