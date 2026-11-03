export type Role = "guest" | "user" | "admin";

export type Action =
  "view_deadline" | "mark_completed" | "create_deadline" | "delete_deadline";

export interface Subject {
  slug: string;
  code: string;
  name: string;
  credits: number;
  description: string;
  lecturer: string;
  color: string;
}

export type Priority = "low" | "medium" | "high";

export interface Deadline {
  id: string;
  title: string;
  description: string;
  subjectSlug: string;
  subjectName: string;
  dueDate: string;
  priority: Priority;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
}
