// src/pages/tasks.tsx
"use client";

import {TaskList, FloatingButton} from "@/components";

export default function TasksPage() {
  return (
    <div className="container mx-auto max-w-md">
      <TaskList />
      <FloatingButton />
    </div>
  );
}
