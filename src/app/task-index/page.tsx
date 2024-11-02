// src/pages/tasks.tsx
"use client";

import TaskList from "@/components/TaskComponents/TaskList";
import FloatingButton from "@/components/FloatingButton";

export default function TasksPage() {
  return (
    <div className="container mx-auto max-w-md">
      <TaskList />
      <FloatingButton />
    </div>
  );
}
