import Link from "next/link";
import { auth, signOut } from "@/auth";

export async function UserMenu() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow active:scale-[0.98] transition-all"
      >
        <span>Đăng nhập</span>
        <svg
          className="w-3.5 h-3.5 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </Link>
    );
  }

  const roleLabel = user.role === "admin" ? "Ban cán sự" : "Sinh viên";

  return (
    <div className="flex items-center gap-2.5 text-xs">
      <div className="text-right hidden sm:block">
        <div className="font-bold text-slate-900 leading-tight">
          {user.name || user.email}
        </div>
        <span
          className={`inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
            user.role === "admin"
              ? "bg-rose-50 text-rose-700 border-rose-200"
              : "bg-indigo-50 text-indigo-700 border-indigo-200"
          }`}
        >
          {roleLabel}
        </span>
      </div>

      <Link
        href="/dashboard"
        className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
      >
        Dashboard
      </Link>

      {user.role === "admin" && (
        <Link
          href="/admin"
          className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 transition-colors hidden sm:inline-block"
        >
          Quản trị vụ
        </Link>
      )}

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
        >
          Đăng xuất
        </button>
      </form>
    </div>
  );
}
