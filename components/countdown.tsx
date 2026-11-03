"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  dueDate: string;
}

export function Countdown({ dueDate }: CountdownProps) {
  const [text, setText] = useState<string>("");
  const [status, setStatus] = useState<"ok" | "urgent" | "overdue">("ok");

  useEffect(() => {
    function calculate() {
      const target = new Date(dueDate).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff < 0) {
        const absDiff = Math.abs(diff);
        const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        setText(days > 0 ? `Quá hạn ${days} ngày` : `Quá hạn ${hours} giờ`);
        setStatus("overdue");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );

      if (days === 0 && hours === 0) {
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setText(`Còn ${minutes} phút`);
        setStatus("urgent");
      } else if (days <= 2) {
        setText(`Còn ${days > 0 ? `${days} ngày ` : ""}${hours} giờ`);
        setStatus("urgent");
      } else {
        setText(`Còn ${days} ngày`);
        setStatus("ok");
      }
    }

    calculate();
    const interval = setInterval(calculate, 60000);
    return () => clearInterval(interval);
  }, [dueDate]);

  if (!text) {
    return <span className="text-slate-400 text-xs font-mono">—</span>;
  }

  const badgeStyles = {
    ok: "bg-slate-100 text-slate-700 border-slate-200/80",
    urgent: "bg-amber-50 text-amber-800 border-amber-200/80 font-semibold",
    overdue: "bg-rose-50 text-rose-800 border-rose-200/80 font-semibold",
  };

  const dotStyles = {
    ok: "bg-slate-400",
    urgent: "bg-amber-500",
    overdue: "bg-rose-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 text-xs sm:text-sm font-semibold rounded-full border ${badgeStyles[status]}`}
    >
      <span className={`w-2 h-2 rounded-full ${dotStyles[status]}`} />
      <span>{text}</span>
    </span>
  );
}
