import Link from "next/link";
import Image from "next/image";

export function PortalFooter() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      {/* Khung 4 Cột Thông Tin Hành Chính Toàn Diện */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Cột 1: Đơn vị chủ quản & Nhận diện (5 cột) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="relative h-13 w-10 shrink-0">
                <Image
                  src="/logo.png"
                  alt="Logo Học viện Công nghệ Bưu chính Viễn thông"
                  width={40}
                  height={52}
                  className="h-12 w-auto object-contain"
                />
              </div>
              <div>
                <span className="font-black text-slate-900 text-base sm:text-lg uppercase leading-tight tracking-tight block">
                  HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG
                </span>
                <span className="text-xs sm:text-sm text-red-700 font-bold tracking-wide uppercase block mt-0.5">
                  KHOA CÔNG NGHỆ THÔNG TIN • BAN CÁN SỰ LỚP
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
              Cổng thông tin quản lý tiến độ học tập và theo dõi hạn nộp bài tập, đồ án
              chuyên ngành chính thức dành cho sinh viên đại học chính quy. Tự động đồng bộ
              dữ liệu thời gian thực và ghi nhận timestamp máy chủ.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs sm:text-sm text-slate-500 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Hệ thống vận hành chính thức • Học kỳ I (2026 – 2027)</span>
            </div>
          </div>

          {/* Cột 2: Trụ sở & Thông tin liên hệ (3 cột) */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 font-mono block pb-2 border-b border-slate-200">
              TRỤ SỞ & LIÊN HỆ
            </span>
            <ul className="text-sm text-slate-600 space-y-2.5 leading-relaxed">
              <li>
                <strong className="text-slate-800 block">Trụ sở chính:</strong>
                <span>Km10, Đường Nguyễn Trãi, Quận Hà Đông, TP. Hà Nội.</span>
              </li>
              <li>
                <strong className="text-slate-800 block">Văn phòng Khoa CNTT:</strong>
                <span>Phòng 202, Nhà A2, Cơ sở Đào tạo Hà Đông.</span>
              </li>
              <li>
                <strong className="text-slate-800 block">Điện thoại / Hotline:</strong>
                <span className="font-mono text-slate-700">(024) 3756 2186</span>
              </li>
              <li>
                <strong className="text-slate-800 block">Hộp thư hỗ trợ học vụ:</strong>
                <span className="font-mono text-red-700">bcs.cntt@ptit.edu.vn</span>
              </li>
            </ul>
          </div>

          {/* Cột 3: Cổng Học Phần (2 cột) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 font-mono block pb-2 border-b border-slate-200">
              HỌC PHẦN KỲ I
            </span>
            <ul className="text-sm font-semibold text-slate-700 space-y-2">
              <li>
                <Link href="/subjects/ltwnc" className="hover:text-red-700 transition-colors">
                  LTW Nâng cao (INT1434)
                </Link>
              </li>
              <li>
                <Link href="/subjects/ktmt" className="hover:text-red-700 transition-colors">
                  KT Máy tính (INT1306)
                </Link>
              </li>
              <li>
                <Link href="/subjects/mmt" className="hover:text-red-700 transition-colors">
                  Mạng máy tính (INT1314)
                </Link>
              </li>
              <li>
                <Link href="/subjects/csdl" className="hover:text-red-700 transition-colors">
                  Cơ sở dữ liệu (INT1339)
                </Link>
              </li>
              <li className="pt-1">
                <Link href="/deadlines" className="text-red-700 hover:text-red-800 font-bold inline-flex items-center gap-1">
                  <span>Toàn bộ 12 bài tập</span>
                  <span>&rarr;</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Quy chế & Điều hướng (2 cột) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 font-mono block pb-2 border-b border-slate-200">
              NGHIỆP VỤ HỌC VỤ
            </span>
            <ul className="text-sm font-semibold text-slate-700 space-y-2">
              <li>
                <Link href="/dashboard" className="hover:text-red-700 transition-colors">
                  Tiến độ cá nhân (SSR)
                </Link>
              </li>
              <li>
                <Link href="/deadlines" className="hover:text-red-700 transition-colors">
                  Sổ Deadline (ISR)
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-red-700 transition-colors">
                  Đăng nhập sinh viên
                </Link>
              </li>
              <li>
                <span className="text-slate-500 font-normal block text-xs mt-2">
                  Quy định số 482/QĐ-HVBCVT về khóa sổ điểm học phần.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Dòng Thể Thức Bản Quyền Dưới Cùng (Copyright Strip) */}
      <div className="bg-slate-50 border-t border-slate-200 py-5">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-600">
          <div>
            <span>© 2026 – 2027 <strong>Học viện Công nghệ Bưu chính Viễn thông</strong>. Bản quyền thuộc Khoa Công nghệ Thông tin.</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
            <span>Next.js 16 App Router</span>
            <span>•</span>
            <span>Auth.js v5</span>
            <span>•</span>
            <span>ISR 60s Revalidation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
