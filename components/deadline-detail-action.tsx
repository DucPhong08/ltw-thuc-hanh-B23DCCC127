import { auth } from "@/auth";
import { getUserCompletions } from "@/lib/data";
import { CompleteToggle } from "./complete-toggle";

interface DeadlineDetailActionProps {
  deadlineId: string;
}

export async function DeadlineDetailAction({
  deadlineId,
}: DeadlineDetailActionProps) {
  const session = await auth();
  const userCompletions = session?.user?.id
    ? await getUserCompletions(session.user.id)
    : [];
  const isCompleted = userCompletions.includes(deadlineId);

  return (
    <CompleteToggle
      deadlineId={deadlineId}
      initialCompleted={isCompleted}
      canMark={Boolean(session?.user?.id)}
    />
  );
}
