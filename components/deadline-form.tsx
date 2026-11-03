"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createDeadlineAction } from "@/actions/deadlines";
import type { Subject } from "@/types";

interface DeadlineFormProps {
  subjects: Subject[];
}

export function DeadlineForm({ subjects }: DeadlineFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectSlug, setSubjectSlug] = useState(subjects[0]?.slug || "ltwnc");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!title || !description || !dueDate) {
      setErrorMsg("Vui lòng điền đầy đủ các thông tin bắt buộc theo quy định.");
      return;
    }

    startTransition(async () => {
      const res = await createDeadlineAction({
        title,
        description,
        subjectSlug,
        dueDate,
        priority,
      });

      if (!res.ok) {
        setErrorMsg(res.message || "Tạo bài tập thất bại.");
      } else {
        setSuccessMsg(
          "Đã ban hành và công bố bài tập mới lên hệ thống thành công!",
        );
        setTitle("");
        setDescription("");
        setDueDate("");
        setPriority("medium");
        router.refresh();
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4"
    >
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Ban hành bài tập mới
        </h2>
        <p className="text-xs text-slate-500">
          Quy định nội dung và thời hạn hoàn thành cho cả lớp
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 text-xs text-rose-700 bg-rose-50 rounded-xl border border-rose-200 leading-relaxed">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-3 text-xs text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200 leading-relaxed">
          {successMsg}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700">
          Tên bài tập / Tiêu đề <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ví dụ: Báo cáo thực hành số 3"
          className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all text-slate-900 placeholder:text-slate-400 shadow-2xs"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Học phần <span className="text-red-500">*</span>
          </label>
          <select
            value={subjectSlug}
            onChange={(e) => setSubjectSlug(e.target.value)}
            className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all text-slate-900 shadow-2xs"
          >
            {subjects.map((sub) => (
              <option key={sub.slug} value={sub.slug}>
                {sub.name} [{sub.code}]
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Mức độ ưu tiên <span className="text-red-500">*</span>
          </label>
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "low" | "medium" | "high")
            }
            className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all text-slate-900 shadow-2xs"
          >
            <option value="high">Ưu tiên cao / Bắt buộc</option>
            <option value="medium">Định kỳ / Trung bình</option>
            <option value="low">Tự chọn / Thấp</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700">
          Hạn chót nộp bài (Ngày & Giờ) <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all text-slate-900 shadow-2xs"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700">
          Yêu cầu chi tiết & Hướng dẫn nghiệm thu{" "}
          <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Nêu rõ hình thức nộp file, quy chuẩn mã nguồn và quy định trừ điểm nếu nộp muộn…"
          className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all text-slate-900 placeholder:text-slate-400 shadow-2xs"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-xs transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
      >
        {isPending ? "Đang lưu bài tập…" : "Ban hành & Công bố bài tập"}
      </button>
    </form>
  );
}
