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

function subscribeTime(callback: () => void) {
  const interval = setInterval(callback, 60000);
  return () => clearInterval(interval);
}

function getTimeSnapshot() {
  return Date.now();
}

function getServerTimeSnapshot() {
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
      // Quick tab filter (1Office style)
      if (quickTab === "high" && item.priority !== "high") return false;
      if (quickTab === "completed" && !completedSet.has(item.id)) return false;
      if (quickTab === "pending" && completedSet.has(item.id)) return false;

      // Dropdown filters
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
      {/* 1Office-Style Administrative Command Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Top Tab Strip (Phong cách Tabs 1Office) */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 pt-4 pb-0 border-b border-slate-200/80 bg-slate-50/50">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs sm:text-sm font-semibold">
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
              <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
                quickTab === "all" ? "bg-red-100 text-red-800" : "bg-slate-200 text-slate-600"
              }`}>
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
              <svg className="w-3.5 h-3.5 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
              </svg>
              <span>Ưu tiên cao</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
                quickTab === "high" ? "bg-rose-100 text-rose-800" : "bg-slate-200 text-slate-600"
              }`}>
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
                  <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
                    quickTab === "pending" ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-600"
                  }`}>
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
                  <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
                    quickTab === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                  }`}>
                    {completedTotal}
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Segmented View Mode Control (Bảng vs Thẻ) */}
          <div className="inline-flex rounded-xl bg-slate-200/80 p-1 mb-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "table"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Dạng Bảng (1Office)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Dạng Thẻ</span>
            </button>
          </div>
        </div>

        {/* Inputs & Dropdowns Toolbar */}
        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
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
                className="w-full text-sm h-11 pl-10 pr-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all text-slate-800 shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Học phần chuyên ngành
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full text-sm h-11 px-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all text-slate-800 shadow-2xs"
            >
              <option value="all">Tất cả môn ({subjects.length})</option>
              {subjects.map((sub) => (
                <option key={sub.slug} value={sub.slug}>
                  {sub.name} [{sub.code}]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Mức độ ưu tiên
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full text-sm h-11 px-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all text-slate-800 shadow-2xs"
            >
              <option value="all">Mọi mức độ</option>
              <option value="high">Ưu tiên cao (High)</option>
              <option value="medium">Trung bình (Medium)</option>
              <option value="low">Thấp (Low)</option>
            </select>
          </div>

          {canMark && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Trạng thái nghĩa vụ nộp
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full text-sm h-11 px-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all text-slate-800 shadow-2xs"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chưa hoàn thành</option>
                <option value="completed">Đã hoàn thành</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Counter & Active Filter Bar */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 px-1 font-medium">
        <span>
          Đang hiển thị <strong className="text-slate-900 font-bold">{filtered.length}</strong> / {initialDeadlines.length} bài tập học vụ
        </span>
        {(selectedSubject !== "all" ||
          selectedPriority !== "all" ||
          selectedStatus !== "all" ||
          quickTab !== "all" ||
          searchQuery) && (
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
        <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center text-slate-500 text-sm shadow-xs">
          Không tìm thấy bài tập nào phù hợp với điều kiện lọc hiện tại.
        </div>
      ) : viewMode === "table" ? (
        /* 1OFFICE ADMINISTRATIVE DATA TABLE */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-xs tracking-wider">
                <tr>
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
                {filtered.map((item, index) => {
                  const isCompleted = completedSet.has(item.id);
                  const isOverdue =
                    now > 0 && new Date(item.dueDate).getTime() < now;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/90 transition-colors ${
                        isCompleted ? "bg-emerald-50/20" : ""
                      }`}
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
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-md">
                            <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                            </svg>
                            <span>Thường</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                            </svg>
                            <span>Thấp</span>
                          </span>
                        )}
                      </td>

                      {/* Tên công việc & Chi tiết */}
                      <td className="py-4.5 px-5">
                        <Link
                          href={`/deadlines/${item.id}`}
                          className="font-bold text-slate-900 hover:text-red-700 transition-colors block text-sm leading-snug"
                        >
                          {item.title}
                        </Link>
                        <p className="text-slate-500 text-xs line-clamp-1 mt-1">
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
                        {canMark ? (
                          <CompleteToggle
                            deadlineId={item.id}
                            initialCompleted={isCompleted}
                            canMark={canMark}
                          />
                        ) : isCompleted ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full">
                            ● Đã hoàn thành
                          </span>
                        ) : isOverdue ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200/70 px-2.5 py-0.5 rounded-full">
                            ● Quá hạn nộp
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200/70 px-2.5 py-0.5 rounded-full">
                            ● Đang thực hiện
                          </span>
                        )}
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
        </div>
      ) : (
        /* CARD VIEW HIỆN ĐẠI */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filtered.map((item) => {
            const isCompleted = completedSet.has(item.id);
            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border p-7 sm:p-8 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-xl hover:-translate-y-1 ${
                  isCompleted
                    ? "border-emerald-300 bg-emerald-50/20"
                    : "border-slate-200/80 hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs sm:text-sm mb-4">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/60">
                      {item.subjectName}
                    </span>
                    <span className="text-xs uppercase font-extrabold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      {item.priority}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg mb-2 leading-snug">
                    <Link
                      href={`/deadlines/${item.id}`}
                      className="hover:text-red-700 transition-colors"
                    >
                      {item.title}
                    </Link>
                  </h3>

                  <p className="text-sm text-slate-600 line-clamp-3 mb-6 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500">
                    <Countdown dueDate={item.dueDate} />
                    <span className="font-mono text-xs">
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
                      className="text-sm font-bold text-slate-700 hover:text-red-700 transition-colors"
                    >
                      Chi tiết &rarr;
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
