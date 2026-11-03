"use client";

import { useTransition } from "react";
import { deleteDeadlineAction } from "@/actions/deadlines";

interface DeleteButtonProps {
  deadlineId: string;
  deadlineTitle: string;
}

export function DeleteButton({ deadlineId, deadlineTitle }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (
      confirm(
        `XÁC NHẬN HỦY BỎ:\nBạn có chắc chắn muốn xóa bài tập "${deadlineTitle}" khỏi sổ học vụ không?\nThao tác này sẽ cập nhật ngay tức thì tới toàn thể sinh viên.`,
      )
    ) {
      startTransition(async () => {
        const res = await deleteDeadlineAction(deadlineId);
        if (!res.ok) {
          alert(res.message || "Xóa bài tập thất bại.");
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition-colors disabled:opacity-50"
      title="Hủy bỏ bài tập này khỏi hệ thống"
    >
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
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
      <span>{isPending ? "Đang hủy..." : "Hủy bài"}</span>
    </button>
  );
}
