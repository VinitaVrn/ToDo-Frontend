export const TODO_TYPES = [
  "task",
  "checklist",
];

export const TODO_STATUSES = [
  "in_progress",
  "blocked",
  "done",
  "cancelled",
];

export const TODO_PRIORITIES = [
  "low",
  "medium",
  "high",
  "critical",
];


export const TODO_STATUS_STYLES = {
  in_progress: "bg-amber-100 text-amber-700",
  blocked: "bg-red-100 text-red-700",
  done: "bg-green-100 text-green-700",
  cancelled: "bg-gray-200 text-gray-500",
};

export const TODO_PRIORITY_COLORS = {
  low: "bg-blue-400",
  medium: "bg-yellow-400",
  high: "bg-orange-400",
  critical: "bg-red-500",
};
export const PAGE_SIZE = 6;