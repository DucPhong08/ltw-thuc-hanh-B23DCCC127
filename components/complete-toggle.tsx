"use client";

import { useState, useTransition } from "react";
import { toggleCompleteAction } from "@/actions/deadlines";

interface CompleteToggleProps {
  deadlineId: string;
  initialCompleted: boolean;
  canMark: boolean;
}

export function CompleteToggle({
  deadlineId,
  initialCompleted,
  canMark,
}: CompleteToggleProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();

  if (!canMark) {
    return (
      <span className="text-[11px] text-slate-500 italic">
        Yêu cầu đăng nhập
      </span>
    );
  }

  const handleToggle = () => {
    startTransition(async () => {
      setIsCompleted(!isCompleted);
      const res = await toggleCompleteAction(deadlineId);
      if (!res.ok) {
        setIsCompleted(initialCompleted);
        alert(res.message || "Không thể cập nhật biên nhận tiến độ.");
      } else if (res.data) {
        setIsCompleted(res.data.isCompleted);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border transition-colors ${
        isCompleted
          ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
      } ${isPending ? "opacity-60 cursor-wait" : ""}`}
      title={
        isCompleted
          ? "Nhấp để hủy đánh dấu hoàn thành bài tập"
          : "Nhấp để xác nhận đã hoàn thành bài tập này"
      }
    >
      <svg
        className={`w-3.5 h-3.5 ${
          isCompleted ? "text-emerald-700" : "text-slate-400"
        }`}
        fill={isCompleted ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{isCompleted ? "Đã hoàn thành" : "Xác nhận đã nộp"}</span>
    </button>
  );
}
