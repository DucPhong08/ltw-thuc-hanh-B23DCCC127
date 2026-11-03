import { can, PERMISSION_MATRIX } from "./permissions";
import type { Action, Role } from "@/types";

describe("Hàm phân quyền can(role, action)", () => {
  describe("Quyền của guest", () => {
    it("được xem deadline", () => {
      expect(can("guest", "view_deadline")).toBe(true);
    });

    it("KHÔNG được đánh dấu đã xong", () => {
      expect(can("guest", "mark_completed")).toBe(false);
    });

    it("KHÔNG được thêm deadline", () => {
      expect(can("guest", "create_deadline")).toBe(false);
    });

    it("KHÔNG được xoá deadline", () => {
      expect(can("guest", "delete_deadline")).toBe(false);
    });
  });

  describe("Quyền của user", () => {
    it("được xem deadline", () => {
      expect(can("user", "view_deadline")).toBe(true);
    });

    it("được đánh dấu đã xong", () => {
      expect(can("user", "mark_completed")).toBe(true);
    });

    it("KHÔNG được thêm deadline", () => {
      expect(can("user", "create_deadline")).toBe(false);
    });

    it("KHÔNG được xoá deadline", () => {
      expect(can("user", "delete_deadline")).toBe(false);
    });
  });

  describe("Quyền của admin", () => {
    it("được xem deadline", () => {
      expect(can("admin", "view_deadline")).toBe(true);
    });

    it("được đánh dấu đã xong", () => {
      expect(can("admin", "mark_completed")).toBe(true);
    });

    it("được thêm deadline", () => {
      expect(can("admin", "create_deadline")).toBe(true);
    });

    it("được xoá deadline", () => {
      expect(can("admin", "delete_deadline")).toBe(true);
    });
  });

  describe("Ma trận toàn vẹn", () => {
    it("mọi tổ hợp vai trò và hành động đều khớp với PERMISSION_MATRIX", () => {
      const roles: Role[] = ["guest", "user", "admin"];
      const actions: Action[] = [
        "view_deadline",
        "mark_completed",
        "create_deadline",
        "delete_deadline",
      ];

      for (const role of roles) {
        for (const action of actions) {
          expect(can(role, action)).toBe(PERMISSION_MATRIX[role][action]);
        }
      }
    });

    it("trả về false khi role không hợp lệ", () => {
      // @ts-expect-error test trường hợp runtime truyền sai role
      expect(can("unknown_role", "view_deadline")).toBe(false);
    });
  });
});
