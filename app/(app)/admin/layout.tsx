import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { can } from "@/lib/permissions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  // Phân quyền độc lập cấp Page (Lớp 2): Chặn truy cập nếu không có quyền admin
  if (!can(session.user.role, "create_deadline")) {
    redirect("/403");
  }

  return <div className="space-y-6">{children}</div>;
}
