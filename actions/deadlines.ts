"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  createDeadline,
  deleteDeadline,
  getSubjectBySlug,
  toggleDeadlineCompletion,
} from "@/lib/data";
import { can } from "@/lib/permissions";
import { createDeadlineSchema, idSchema } from "@/lib/validation";
import type { Role } from "@/types";

export interface ActionResult<T = unknown> {
  ok: boolean;
  message?: string;
  data?: T;
}

export async function toggleCompleteAction(
  deadlineId: string,
): Promise<ActionResult<{ isCompleted: boolean }>> {
  const session = await auth();
  const role: Role = session?.user?.role || "guest";

  if (!session?.user?.id || !can(role, "mark_completed")) {
    return {
      ok: false,
      message: "Bạn không có quyền thực hiện hành động này.",
    };
  }

  const parsedId = idSchema.safeParse(deadlineId);
  if (!parsedId.success) {
    return { ok: false, message: "ID deadline không hợp lệ." };
  }

  try {
    const isCompleted = await toggleDeadlineCompletion(
      session.user.id,
      parsedId.data,
    );

    // Revalidate các trang hiển thị trạng thái
    revalidatePath("/dashboard");
    revalidatePath(`/deadlines/${parsedId.data}`);
    revalidatePath("/deadlines");

    return { ok: true, data: { isCompleted } };
  } catch (error) {
    console.error("toggleCompleteAction error:", error);
    return { ok: false, message: "Lỗi hệ thống khi cập nhật trạng thái." };
  }
}

export async function createDeadlineAction(
  raw: unknown,
): Promise<ActionResult> {
  const session = await auth();
  const role: Role = session?.user?.role || "guest";

  // Phân quyền độc lập ở Server Action
  if (!can(role, "create_deadline")) {
    return {
      ok: false,
      message: "Chỉ quản trị viên (Admin) mới có quyền thêm deadline.",
    };
  }

  const parsed = createDeadlineSchema.safeParse(raw);
  if (!parsed.success) {
    const firstIssue =
      parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ.";
    return { ok: false, message: firstIssue };
  }

  try {
    const subject = await getSubjectBySlug(parsed.data.subjectSlug);
    const subjectName = subject?.name ?? parsed.data.subjectSlug.toUpperCase();

    const created = await createDeadline({
      title: parsed.data.title,
      description: parsed.data.description,
      subjectSlug: parsed.data.subjectSlug,
      subjectName,
      dueDate: new Date(parsed.data.dueDate).toISOString(),
      priority: parsed.data.priority,
    });

    // On-demand revalidation: làm mới ISR ngay lập tức khi admin thêm
    revalidatePath("/deadlines");
    revalidatePath(`/deadlines/${created.id}`);
    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath(`/subjects/${parsed.data.subjectSlug}`);
    revalidatePath("/");

    return { ok: true, data: created };
  } catch (error) {
    console.error("createDeadlineAction error:", error);
    return { ok: false, message: "Lỗi hệ thống khi tạo deadline." };
  }
}

export async function deleteDeadlineAction(
  deadlineId: string,
): Promise<ActionResult> {
  const session = await auth();
  const role: Role = session?.user?.role || "guest";

  // Phân quyền độc lập ở Server Action
  if (!can(role, "delete_deadline")) {
    return {
      ok: false,
      message: "Chỉ quản trị viên (Admin) mới có quyền xoá deadline.",
    };
  }

  const parsedId = idSchema.safeParse(deadlineId);
  if (!parsedId.success) {
    return { ok: false, message: "ID deadline không hợp lệ." };
  }

  try {
    const success = await deleteDeadline(parsedId.data);
    if (!success) {
      return { ok: false, message: "Không tìm thấy deadline cần xoá." };
    }

    // On-demand revalidation: làm mới ISR ngay lập tức khi admin xoá
    revalidatePath("/deadlines");
    revalidatePath(`/deadlines/${parsedId.data}`);
    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath("/");

    return { ok: true };
  } catch (error) {
    console.error("deleteDeadlineAction error:", error);
    return { ok: false, message: "Lỗi hệ thống khi xoá deadline." };
  }
}
