import type { Metadata } from "next";
import Link from "next/link";
import { getDeadlines, getSubjects } from "@/lib/data";
import { DeadlineForm } from "@/components/deadline-form";
import { DeleteButton } from "@/components/delete-button";
import { Countdown } from "@/components/countdown";

// Chiến lược SSR (Server-Side Rendering) bắt buộc theo đề bài
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quản trị Bài tập — Ban Cán Sự Lớp PTIT",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const [subjects, deadlines] = await Promise.all([
    getSubjects(),
    getDeadlines(),
  ]);

  return (
    <div className="space-y-8">
      {/* Tiêu đề nghiệp vụ quản trị — Spacious Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-xs uppercase font-bold bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full font-mono">
              NGHIỆP VỤ BAN CÁN SỰ (ADMIN)
            </span>
            <span className="text-xs sm:text-sm text-slate-500 font-medium">
              Khu vực quản lý học vụ chính quy
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Quản trị bài tập & Thời hạn học vụ
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl mt-2 leading-relaxed">
            Thêm bài tập mới, điều chỉnh thời hạn hoặc xóa bài tập đã hủy. Thao
            tác sẽ cập nhật ngay tức thì tới toàn thể sinh viên qua cơ chế On-Demand
            ISR của Next.js App Router.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="text-sm sm:text-base font-bold px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-all shadow-xs self-start sm:self-auto shrink-0"
        >
          &larr; Về Dashboard sinh viên
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form thêm bài tập mới */}
        <div className="lg:col-span-1">
          <DeadlineForm subjects={subjects} />
        </div>

        {/* Bảng danh sách bài tập */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-7 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Danh sách bài tập hiện có ({deadlines.length})
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Hệ thống tự động kích hoạt revalidatePath khi thêm hoặc xóa
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-base">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200 text-xs sm:text-sm tracking-wider">
                <tr>
                  <th className="py-4 px-4 w-14 text-center font-mono">#</th>
                  <th className="py-4 px-4 w-44">Học phần</th>
                  <th className="py-4 px-5">Tiêu đề bài tập</th>
                  <th className="py-4 px-5 w-44">Thời hạn</th>
                  <th className="py-4 px-4 w-28 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deadlines.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-4.5 px-4 text-center font-mono text-sm font-bold text-slate-400">
                      #{item.id}
                    </td>
                    <td className="py-4.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900 block text-sm sm:text-base">
                        {item.subjectName}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">
                        {item.subjectSlug.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4.5 px-5">
                      <Link
                        href={`/deadlines/${item.id}`}
                        className="font-bold text-slate-900 hover:text-red-700 transition-colors block text-base leading-snug line-clamp-1"
                      >
                        {item.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <Countdown dueDate={item.dueDate} />
                        {item.priority === "high" && (
                          <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                            Ưu tiên cao
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4.5 px-5 whitespace-nowrap text-slate-800">
                      <span className="font-bold text-sm block">
                        {new Date(item.dueDate).toLocaleDateString("vi-VN")}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {new Date(item.dueDate).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="py-4.5 px-4 text-right whitespace-nowrap">
                      <DeleteButton
                        deadlineId={item.id}
                        deadlineTitle={item.title}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
