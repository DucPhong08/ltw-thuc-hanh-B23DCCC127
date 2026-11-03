import Link from "next/link";
import { auth, signOut } from "@/auth";

export async function UserMenu() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2.5 px-6 py-2.5 sm:px-7 sm:py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm sm:text-base font-bold rounded-2xl shadow-xs hover:shadow active:scale-[0.98] transition-all"
      >
        <span>Đăng nhập</span>
        <svg
          className="w-4 h-4 text-slate-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </Link>
    );
  }

  const roleLabel = user.role === "admin" ? "Ban cán sự" : "Sinh viên";

  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="text-right hidden sm:block">
        <div className="font-bold text-slate-900 leading-tight">
          {user.name || user.email}
        </div>
        <span
          className={`inline-block text-xs font-bold uppercase px-2.5 py-0.5 rounded-full border mt-0.5 ${
            user.role === "admin"
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-slate-100 text-slate-700 border-slate-200"
          }`}
        >
          {roleLabel}
        </span>
      </div>

      <Link
        href="/dashboard"
        className="px-4 py-2.5 text-sm font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors"
      >
        Dashboard
      </Link>

      {user.role === "admin" && (
        <Link
          href="/admin"
          className="px-4 py-2.5 text-sm font-bold rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors hidden sm:inline-block"
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
          className="px-4 py-2.5 text-sm font-bold rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition-colors cursor-pointer"
        >
          Đăng xuất
        </button>
      </form>
    </div>
  );
}
