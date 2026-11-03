import type { Action, Role } from "@/types";

export const PERMISSION_MATRIX: Record<Role, Record<Action, boolean>> = {
  guest: {
    view_deadline: true,
    mark_completed: false,
    create_deadline: false,
    delete_deadline: false,
  },
  user: {
    view_deadline: true,
    mark_completed: true,
    create_deadline: false,
    delete_deadline: false,
  },
  admin: {
    view_deadline: true,
    mark_completed: true,
    create_deadline: true,
    delete_deadline: true,
  },
};

/**
 * Kiểm tra xem một vai trò (role) có quyền thực hiện hành động (action) hay không.
 * Ma trận phân quyền tập trung duy nhất tại hệ thống.
 */
export function can(role: Role, action: Action): boolean {
  const roleRules = PERMISSION_MATRIX[role];
  if (!roleRules) return false;
  return Boolean(roleRules[action]);
}
