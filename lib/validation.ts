import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ").toLowerCase(),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

export const createDeadlineSchema = z.object({
  title: z
    .string()
    .min(3, "Tiêu đề phải có ít nhất 3 ký tự")
    .max(120, "Tiêu đề không quá 120 ký tự"),
  description: z
    .string()
    .min(5, "Mô tả phải có ít nhất 5 ký tự")
    .max(1000, "Mô tả không quá 1000 ký tự"),
  subjectSlug: z.enum(["ltwnc", "ktmt", "mmt", "csdl"], {
    errorMap: () => ({ message: "Môn học không hợp lệ" }),
  }),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Thời hạn phải là định dạng ngày giờ hợp lệ",
  }),
  priority: z.enum(["low", "medium", "high"], {
    errorMap: () => ({
      message: "Mức độ ưu tiên phải là low, medium hoặc high",
    }),
  }),
});

export const idSchema = z.string().min(1, "ID không được để trống");
