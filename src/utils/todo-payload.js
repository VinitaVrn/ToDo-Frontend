  export const buildTodoPayload = (form) => ({
  title: form.title.trim(),
  description: form.description || undefined,
  type: form.type,
  status: form.status,
  priority: form.priority,
  tags: form.tags
    ? form.tags.split(",").map(tag => tag.trim()).filter(Boolean)
    : [],
  dueDate: form.dueDate || undefined,
  items:
    form.type === "checklist"
      ? form.items
          .filter(item => item.trim())
          .map((content, position) => ({
            content,
            position,
          }))
      : undefined,
});