import fs from "fs/promises";
import path from "path";
import type { Deadline, Subject, User } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const SUBJECTS_FILE = path.join(DATA_DIR, "subjects.json");
const DEADLINES_FILE = path.join(DATA_DIR, "deadlines.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const COMPLETIONS_FILE = path.join(DATA_DIR, "completions.json");

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
}

async function writeJson<T>(filePath: string, data: T): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function getSubjects(): Promise<Subject[]> {
  return readJson<Subject[]>(SUBJECTS_FILE, []);
}

export async function getSubjectBySlug(slug: string): Promise<Subject | null> {
  const list = await getSubjects();
  return list.find((s) => s.slug === slug) ?? null;
}

export async function getDeadlines(): Promise<Deadline[]> {
  const list = await readJson<Deadline[]>(DEADLINES_FILE, []);
  // Sắp xếp hạn chót gần nhất trước
  return list.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  );
}

export async function getDeadlineById(id: string): Promise<Deadline | null> {
  const list = await getDeadlines();
  return list.find((d) => d.id === id) ?? null;
}

export async function getDeadlinesBySubject(slug: string): Promise<Deadline[]> {
  const list = await getDeadlines();
  return list.filter((d) => d.subjectSlug === slug);
}

export async function createDeadline(
  payload: Omit<Deadline, "id" | "createdAt">,
): Promise<Deadline> {
  const list = await readJson<Deadline[]>(DEADLINES_FILE, []);
  // Tìm max ID số hoặc tạo ID mới
  const maxId = list.reduce((max, item) => {
    const n = parseInt(item.id, 10);
    return isNaN(n) ? max : Math.max(max, n);
  }, 0);

  const newDeadline: Deadline = {
    ...payload,
    id: String(maxId + 1),
    createdAt: new Date().toISOString(),
  };

  list.push(newDeadline);
  await writeJson(DEADLINES_FILE, list);
  return newDeadline;
}

export async function deleteDeadline(id: string): Promise<boolean> {
  const list = await readJson<Deadline[]>(DEADLINES_FILE, []);
  const initialLen = list.length;
  const filtered = list.filter((d) => d.id !== id);
  if (filtered.length === initialLen) return false;

  await writeJson(DEADLINES_FILE, filtered);

  // Dọn dẹp cả trong completions
  const completions = await readJson<Record<string, string[]>>(
    COMPLETIONS_FILE,
    {},
  );
  let changed = false;
  for (const uid of Object.keys(completions)) {
    if (completions[uid].includes(id)) {
      completions[uid] = completions[uid].filter((x) => x !== id);
      changed = true;
    }
  }
  if (changed) {
    await writeJson(COMPLETIONS_FILE, completions);
  }

  return true;
}

export async function getUserCompletions(userId: string): Promise<string[]> {
  const completions = await readJson<Record<string, string[]>>(
    COMPLETIONS_FILE,
    {},
  );
  return completions[userId] ?? [];
}

export async function toggleDeadlineCompletion(
  userId: string,
  deadlineId: string,
): Promise<boolean> {
  const completions = await readJson<Record<string, string[]>>(
    COMPLETIONS_FILE,
    {},
  );
  const current = new Set(completions[userId] ?? []);
  let isDoneNow = false;

  if (current.has(deadlineId)) {
    current.delete(deadlineId);
    isDoneNow = false;
  } else {
    current.add(deadlineId);
    isDoneNow = true;
  }

  completions[userId] = Array.from(current);
  await writeJson(COMPLETIONS_FILE, completions);
  return isDoneNow;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await readJson<User[]>(USERS_FILE, []);
  return (
    users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null
  );
}
