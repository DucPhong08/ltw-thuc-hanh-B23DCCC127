"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Countdown } from "./countdown";
import { CompleteToggle } from "./complete-toggle";
import type { Deadline, Subject } from "@/types";

interface DeadlineFilterProps {
  initialDeadlines: Deadline[];
  subjects: Subject[];
  userCompletions?: string[];
  canMark?: boolean;
}

let cachedTime = 0;
const timeListeners = new Set<() => void>();

if (typeof window !== "undefined") {
  cachedTime = Date.now();
  setInterval(() => {
    cachedTime = Date.now();
    timeListeners.forEach((fn) => fn());
  }, 60000);
}

function subscribeTime(callback: () => void) {
  timeListeners.add(callback);
  return () => {
    timeListeners.delete(callback);
  };
}

function getTimeSnapshot(): number {
  if (cachedTime === 0 && typeof window !== "undefined") {
    cachedTime = Date.now();
  }
  return cachedTime;
}

function getServerTimeSnapshot(): number {
  return 0;
}

export function DeadlineFilter({
  initialDeadlines,
  subjects,
  userCompletions = [],
  canMark = false,
}: DeadlineFilterProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [quickTab, setQuickTab] = useState<"all" | "high" | "pending" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"table" | "list">("table");
  const now = useSyncExternalStore(subscribeTime, getTimeSnapshot, getServerTimeSnapshot);

  const completedSet = useMemo(
    () => new Set(userCompletions),
    [userCompletions],
  );

  const urgentTotal = useMemo(
    () => initialDeadlines.filter((d) => d.priority === "high").length,
    [initialDeadlines]
  );

  const completedTotal = useMemo(
    () => initialDeadlines.filter((d) => completedSet.has(d.id)).length,
    [initialDeadlines, completedSet]
  );

  const pendingTotal = useMemo(
    () => initialDeadlines.length - completedTotal,
    [initialDeadlines, completedTotal]
  );

  const filtered = useMemo(() => {
    return initialDeadlines.filter((item) => {
      // Tab lọc nhanh
      if (quickTab === "high" && item.priority !== "high") return false;
      if (quickTab === "completed" && !completedSet.has(item.id)) return false;
      if (quickTab === "pending" && completedSet.has(item.id)) return false;

      // Lọc theo dropdown
      if (selectedSubject !== "all" && item.subjectSlug !== selectedSubject) {
        return false;
      }
      if (selectedPriority !== "all" && item.priority !== selectedPriority) {
        return false;
      }
      if (selectedStatus === "completed" && !completedSet.has(item.id)) {
        return false;
      }
      if (selectedStatus === "pending" && completedSet.has(item.id)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchSubject = item.subjectName.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        if (!matchTitle && !matchSubject && !matchDesc) return false;
      }
      return true;
    });
  }, [
    initialDeadlines,
    quickTab,
    selectedSubject,
    selectedPriority,
    selectedStatus,
    searchQuery,
    completedSet,
  ]);

  return (
    <div className="space-y-6">
      {/* Bảng Điều Khiển Học Vụ — Màu sắc đồng nhất, phân cấp rõ ràng */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Thanh Tab Điều Phối Nhanh */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 pt-4 pb-0 border-b border-slate-200 bg-slate-50/60">
          <div className="flex items-center gap-2 overflow-x-auto text-sm sm:text-base font-bold">
            <button
              type="button"
              onClick={() => {
                setQuickTab("all");
                setSelectedPriority("all");
                setSelectedStatus("all");
              }}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 font-bold transition-all ${
                quickTab === "all"
                  ? "border-red-700 text-red-700"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Tất cả bài tập</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-200 text-slate-700">
                {initialDeadlines.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setQuickTab("high");
                setSelectedPriority("all");
              }}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 font-bold transition-all ${
                quickTab === "high"
                  ? "border-red-700 text-red-700"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
              </svg>
              <span>Ưu tiên cao</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-red-100 text-red-800">
                {urgentTotal}
              </span>
            </button>

            {canMark && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setQuickTab("pending");
                    setSelectedStatus("all");
                  }}
                  className={`flex items-center gap-2 py-3 px-3.5 border-b-2 font-bold transition-all ${
                    quickTab === "pending"
                      ? "border-red-700 text-red-700"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>Chưa nộp</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-200 text-slate-700">
                    {pendingTotal}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setQuickTab("completed");
                    setSelectedStatus("all");
                  }}
                  className={`flex items-center gap-2 py-3 px-3.5 border-b-2 font-bold transition-all ${
                    quickTab === "completed"
                      ? "border-red-700 text-red-700"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>Đã hoàn thành</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800">
                    {completedTotal}
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Điều khiển chuyển đổi Chế độ xem */}
          <div className="inline-flex rounded-xl bg-slate-200/90 p-1 mb-2 text-xs sm:text-sm font-semibold">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                viewMode === "table"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Dạng Bảng</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Dạng Thẻ</span>
            </button>
          </div>
        </div>

        {/* Khung Bộ Lọc & Tìm Kiếm — Cỡ chữ to rõ, khoảng cách thoáng */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="relative">
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Tìm theo tiêu đề / nội dung
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Nhập tên bài, mô tả…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-base h-12 pl-10 pr-4 bg-white border border-slate-300 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all text-slate-900 shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Lọc theo học phần
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full text-base h-12 px-3.5 bg-white border border-slate-300 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all text-slate-900 shadow-2xs font-medium cursor-pointer"
            >
              <option value="all">Tất cả môn học ({subjects.length})</option>
              {subjects.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Mức độ ưu tiên
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full text-base h-12 px-3.5 bg-white border border-slate-300 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all text-slate-900 shadow-2xs font-medium cursor-pointer"
            >
              <option value="all">Tất cả mức độ</option>
              <option value="high">Ưu tiên cao (bắt buộc)</option>
              <option value="medium">Mức độ thường</option>
              <option value="low">Mức độ thấp</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Trạng thái nộp bài
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-base h-12 px-3.5 bg-white border border-slate-300 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all text-slate-900 shadow-2xs font-medium cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chưa hoàn thành</option>
              <option value="completed">Đã nộp / Hoàn thành</option>
            </select>
          </div>
        </div>
      </div>

      {/* Thông tin kết quả tìm kiếm */}
      <div className="flex items-center justify-between text-sm sm:text-base text-slate-600 px-2 font-medium">
        <span>
          Đang hiển thị <strong className="text-slate-900 font-bold">{filtered.length}</strong> / {initialDeadlines.length} bài tập
        </span>
        {(selectedSubject !== "all" ||
          selectedPriority !== "all" ||
          selectedStatus !== "all" ||
          quickTab !== "all" ||
          searchQuery.trim()) && (
          <button
            type="button"
            onClick={() => {
              setQuickTab("all");
              setSelectedSubject("all");
              setSelectedPriority("all");
              setSelectedStatus("all");
              setSearchQuery("");
            }}
            className="text-red-700 font-bold hover:underline"
          >
            Đặt lại bộ lọc
          </button>
        )}
      </div>

      {/* Render Danh sách */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center text-slate-600 text-base shadow-xs">
          Không tìm thấy bài tập nào phù hợp với điều kiện lọc hiện tại.
        </div>
      ) : viewMode === "table" ? (
        /* BẢNG DỮ LIỆU HỌC VỤ HÀNH CHÍNH — Cỡ chữ to, màu sắc nhã nhặn */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-base">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-xs sm:text-sm tracking-wider">
                <tr>
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
                {filtered.map((item, index) => {
                  const isCompleted = completedSet.has(item.id);
                  const isOverdue =
                    now > 0 && new Date(item.dueDate).getTime() < now;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isCompleted ? "bg-emerald-50/20" : ""
                      }`}
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

                      {/* Tiêu đề & Mô tả */}
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

                      {/* Hạn chót */}
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

                      {/* Trạng thái / Nút đánh dấu */}
                      <td className="py-5 px-5 text-center whitespace-nowrap">
                        {canMark ? (
                          <CompleteToggle
                            deadlineId={item.id}
                            initialCompleted={isCompleted}
                            canMark={canMark}
                          />
                        ) : isCompleted ? (
                          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full">
                            ● Đã hoàn thành
                          </span>
                        ) : isOverdue ? (
                          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-red-800 bg-red-50 border border-red-200 px-3.5 py-1 rounded-full">
                            ● Quá hạn nộp
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3.5 py-1 rounded-full">
                            ● Đang thực hiện
                          </span>
                        )}
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
        </div>
      ) : (
        /* DẠNG THẺ — Thoáng, chữ to rõ */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filtered.map((item) => {
            const isCompleted = completedSet.has(item.id);
            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border p-7 sm:p-8 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-xl hover:-translate-y-1 ${
                  isCompleted
                    ? "border-emerald-300 bg-emerald-50/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                      {item.subjectName}
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-bold px-2.5 py-0.5 rounded-md border ${
                        item.priority === "high"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {item.priority === "high" ? "Ưu tiên cao" : "Thường"}
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 text-xl leading-snug">
                    <Link
                      href={`/deadlines/${item.id}`}
                      className="hover:text-red-700 transition-colors"
                    >
                      {item.title}
                    </Link>
                  </h3>

                  <p className="text-base text-slate-600 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex flex-col gap-3.5">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <Countdown dueDate={item.dueDate} />
                    <span className="font-mono text-sm font-bold text-slate-700">
                      {new Date(item.dueDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <CompleteToggle
                      deadlineId={item.id}
                      initialCompleted={isCompleted}
                      canMark={canMark}
                    />
                    <Link
                      href={`/deadlines/${item.id}`}
                      className="text-base font-bold text-red-700 hover:text-red-800 transition-colors inline-flex items-center gap-1"
                    >
                      <span>Chi tiết</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
