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
      <div className="bg-white rounded-3xl border border-rose-200/80 p-8 sm:p-10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-xs uppercase font-bold bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full font-mono">
              ĐẶC QUYỀN LỚP TRƯỞNG (SSR)
            </span>
            <span className="text-xs sm:text-sm text-slate-500 font-medium">
              Khu vực quản trị học vụ
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Quản trị bài tập & Thời hạn học vụ
          </h1>
          <p className="text-sm text-slate-500 max-w-3xl mt-2 leading-relaxed">
            Thêm bài tập mới, điều chỉnh thời hạn hoặc xóa bài tập đã hủy. Thao
            tác sẽ cập nhật ngay tức thì tới toàn thể sinh viên qua On-Demand
            ISR.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="text-sm font-bold px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl transition-colors self-start sm:self-auto shrink-0"
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
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-7 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Danh sách bài tập hiện có ({deadlines.length})
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Hệ thống tự động kích hoạt revalidatePath khi thêm hoặc xóa
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-slate-500 uppercase font-bold border-b border-slate-200/80 text-xs tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-14 text-center font-mono">ID</th>
                  <th className="py-3.5 px-4 w-44">Học phần</th>
                  <th className="py-3.5 px-4">Tiêu đề bài tập</th>
                  <th className="py-3.5 px-4 w-40">Thời hạn</th>
                  <th className="py-3.5 px-4 w-28 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deadlines.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-4 px-4 text-center font-mono text-slate-400">
                      #{item.id}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900 block">
                        {item.subjectName}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Link
                        href={`/deadlines/${item.id}`}
                        className="font-bold text-slate-900 hover:text-red-700 transition-colors block line-clamp-1"
                      >
                        {item.title}
                      </Link>
                      <span className="text-xs text-slate-400 font-mono">
                        Ưu tiên: {item.priority.toUpperCase()} •{" "}
                        {new Date(item.dueDate).toLocaleDateString("vi-VN")}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <Countdown dueDate={item.dueDate} />
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
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
