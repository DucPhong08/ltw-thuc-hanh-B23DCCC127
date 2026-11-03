"use client";

import { useMemo, useState } from "react";
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

export function DeadlineFilter({
  initialDeadlines,
  subjects,
  userCompletions = [],
  canMark = false,
}: DeadlineFilterProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"table" | "list">("table");

  const completedSet = useMemo(
    () => new Set(userCompletions),
    [userCompletions],
  );

  const filtered = useMemo(() => {
    return initialDeadlines.filter((item) => {
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
    selectedSubject,
    selectedPriority,
    selectedStatus,
    searchQuery,
    completedSet,
  ]);

  return (
    <div className="space-y-6">
      {/* Spacious Modern Filter Toolbar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-sm sm:text-base font-bold text-slate-900">
              Bộ lọc & Tìm kiếm bài tập
            </span>
            <span className="text-xs sm:text-sm text-slate-500 font-mono bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200/60">
              {initialDeadlines.length} bài
            </span>
          </div>

          {/* Segmented View Mode Control */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 self-start sm:self-auto text-xs sm:text-sm font-semibold">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
                viewMode === "table"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Dạng Bảng (Table)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              <span>Dạng Thẻ (Cards)</span>
            </button>
          </div>
        </div>

        {/* Inputs & Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tìm theo tiêu đề
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Tìm bài tập, nội dung…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm h-11 pl-10 pr-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all text-slate-800 shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Học phần
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
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Trạng thái nộp bài
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

      {/* Counter Bar */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 px-1 font-medium">
        <span>
          Đang hiển thị <strong>{filtered.length}</strong> /{" "}
          {initialDeadlines.length} bài tập
        </span>
        {(selectedSubject !== "all" ||
          selectedPriority !== "all" ||
          selectedStatus !== "all" ||
          searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedSubject("all");
              setSelectedPriority("all");
              setSelectedStatus("all");
              setSearchQuery("");
            }}
            className="text-slate-900 font-bold hover:underline"
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
        /* TABLE VIEW HIỆN ĐẠI */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200/80 uppercase text-xs tracking-wider">
                <tr>
                  <th className="py-4 px-5 w-14 text-center font-mono">#</th>
                  <th className="py-4 px-5 w-48">Học phần</th>
                  <th className="py-4 px-5">Tiêu đề bài tập & Nội dung</th>
                  <th className="py-4 px-5 w-48">Hạn chót</th>
                  <th className="py-4 px-5 w-44">Thời gian còn lại</th>
                  <th className="py-4 px-5 w-40 text-center">Trạng thái</th>
                  <th className="py-4 px-5 w-24 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item, index) => {
                  const isCompleted = completedSet.has(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isCompleted ? "bg-emerald-50/20" : ""
                      }`}
                    >
                      <td className="py-4.5 px-5 text-center font-mono text-slate-400">
                        {index + 1}
                      </td>
                      <td className="py-4.5 px-5 whitespace-nowrap">
                        <span className="font-bold text-slate-900 block">
                          {item.subjectName}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {item.subjectSlug.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4.5 px-5">
                        <Link
                          href={`/deadlines/${item.id}`}
                          className="font-bold text-slate-900 hover:text-red-700 transition-colors block leading-snug"
                        >
                          {item.title}
                        </Link>
                        <p className="text-slate-500 text-xs line-clamp-1 mt-1">
                          {item.description}
                        </p>
                      </td>
                      <td className="py-4.5 px-5 whitespace-nowrap text-slate-700">
                        <span className="font-semibold block">
                          {new Date(item.dueDate).toLocaleDateString("vi-VN")}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {new Date(item.dueDate).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>
                      <td className="py-4.5 px-5 whitespace-nowrap">
                        <Countdown dueDate={item.dueDate} />
                      </td>
                      <td className="py-4.5 px-5 text-center whitespace-nowrap">
                        <CompleteToggle
                          deadlineId={item.id}
                          initialCompleted={isCompleted}
                          canMark={canMark}
                        />
                      </td>
                      <td className="py-4.5 px-5 text-right whitespace-nowrap">
                        <Link
                          href={`/deadlines/${item.id}`}
                          className="font-bold text-slate-700 hover:text-red-700 text-sm transition-colors"
                        >
                          Xem &rarr;
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
