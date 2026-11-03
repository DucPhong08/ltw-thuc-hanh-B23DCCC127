import { auth } from "@/auth";
import { getUserCompletions } from "@/lib/data";
import { DeadlineFilter } from "./deadline-filter";
import type { Deadline, Subject } from "@/types";

interface DeadlinesContentProps {
  deadlines: Deadline[];
  subjects: Subject[];
}

export async function DeadlinesContent({
  deadlines,
  subjects,
}: DeadlinesContentProps) {
  const session = await auth();
  const userCompletions = session?.user?.id
    ? await getUserCompletions(session.user.id)
    : [];

  return (
    <DeadlineFilter
      initialDeadlines={deadlines}
      subjects={subjects}
      userCompletions={userCompletions}
      canMark={Boolean(session?.user?.id)}
    />
  );
}
