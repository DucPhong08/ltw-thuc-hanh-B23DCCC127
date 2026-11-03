"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardNavProps {
  isAdmin?: boolean;
}

export function DashboardNav({ isAdmin = false }: DashboardNavProps) {
  const pathname = usePathname();

  const links = [
    {
      href: "/dashboard",
      label: "Tiến độ học tập cá nhân",
      code: "REC-01",
    },
    {
      href: "/deadlines",
      label: "Toàn bộ sổ theo dõi Deadline",
      code: "ALL-12",
    },
    {
      href: "/subjects/ltwnc",
      label: "Học phần: Lập trình Web Nâng Cao",
      code: "INT1434",
    },
    {
      href: "/subjects/ktmt",
      label: "Học phần: Kiến trúc Máy tính",
      code: "INT1306",
    },
    {
      href: "/subjects/mmt",
      label: "Học phần: Mạng Máy tính",
      code: "INT1314",
    },
    {
      href: "/subjects/csdl",
      label: "Học phần: Cơ sở Dữ liệu",
      code: "INT1339",
    },
  ];

  if (isAdmin) {
    links.push({
      href: "/admin",
      label: "Nghiệp vụ Quản trị Lớp trưởng",
      code: "ADM-99",
    });
  }

  return (
    <nav className="space-y-1">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
              isActive
                ? "bg-slate-900 text-white font-semibold shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
            }`}
          >
            <span className="truncate pr-2">{link.label}</span>
            <span
              className={`font-mono text-[10px] px-1.5 py-0.5 rounded-md ${
                isActive
                  ? "bg-slate-800 text-slate-300"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {link.code}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
