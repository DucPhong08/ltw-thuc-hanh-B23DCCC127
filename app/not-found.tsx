import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/80 p-8 text-center shadow-xs">
        <span className="text-5xl font-black text-slate-900 block mb-2 font-mono">
          404
        </span>
        <h1 className="text-xl font-bold text-slate-900 mb-2">
          Không tìm thấy trang yêu cầu
        </h1>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Nội dung bạn đang tìm kiếm (môn học hoặc bài tập) không tồn tại hoặc
          đã được cập nhật đường dẫn mới.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
        >
          &larr; Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
}
