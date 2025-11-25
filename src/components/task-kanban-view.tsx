import { Flag, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

interface Task {
  _id: string;
  title: string;
  description: string;
  estimated_hours: number;
  priority: "high" | "medium" | "low";
  status: "todo" | "in_progress" | "completed";
  due_date: string;
  category?: string;
}

interface TaskKanbanViewProps {
  todoTasks: Task[];
  inProgressTasks: Task[];
  completedTasks: Task[];
  onTaskClick: (task: Task) => void;
  onUpdateTaskStatus: (taskId: string, status: string) => void;
}

export function TaskKanbanView({
  todoTasks,
  inProgressTasks,
  completedTasks,
  onTaskClick,
  onUpdateTaskStatus,
}: TaskKanbanViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find which column the task was dropped on
    let targetColumn = overId;
    
    // If dropped on another task, find which column that task belongs to
    if (!['todo', 'in_progress', 'completed'].includes(overId)) {
      // Check each column to find where the overId task is
      if (todoTasks.some(t => t._id === overId)) {
        targetColumn = 'todo';
      } else if (inProgressTasks.some(t => t._id === overId)) {
        targetColumn = 'in_progress';
      } else if (completedTasks.some(t => t._id === overId)) {
        targetColumn = 'completed';
      }
    }

    // Find which column the task came from
    let sourceColumn = '';
    if (todoTasks.some(t => t._id === activeId)) {
      sourceColumn = 'todo';
    } else if (inProgressTasks.some(t => t._id === activeId)) {
      sourceColumn = 'in_progress';
    } else if (completedTasks.some(t => t._id === activeId)) {
      sourceColumn = 'completed';
    }

    // Only update if moved to a different column
    if (sourceColumn && targetColumn && sourceColumn !== targetColumn) {
      onUpdateTaskStatus(activeId, targetColumn);
    }
  };

  const DraggableTaskCard = ({ task }: { task: Task }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div ref={setNodeRef} style={style}>
        <TaskCard task={task} attributes={attributes} listeners={listeners} />
      </div>
    );
  };

  const TaskCard = ({ task, attributes, listeners }: { task: Task; attributes?: any; listeners?: any }) => (
    <div
      className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onTaskClick(task)}
    >
      <div className="flex items-start gap-2 mb-2">
        {attributes && listeners && (
          <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing mt-0.5">
            <GripVertical className="h-4 w-4 text-gray-400" />
          </button>
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1">
              {task.title}
            </h4>
            <Flag
              className={cn(
                "w-3 h-3 fill-current ml-2 flex-shrink-0",
                task.priority === "high"
                  ? "text-red-500"
                  : task.priority === "medium"
                    ? "text-amber-500"
                    : "text-green-500"
              )}
            />
          </div>
        </div>
      </div>
      {task.description && (
        <p className="text-xs text-gray-600 mb-2">
          {(() => {
            const cleanText = task.description.replace(/<[^>]*>/g, "").trim();
            const words = cleanText.split(" ");
            if (words.length <= 5) return cleanText;
            return `${words.slice(0, 5).join(" ")}...`;
          })()}
        </p>
      )}
      <div className="flex items-center justify-between">
        {task.category && (
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {task.category}
          </span>
        )}
        <span className="text-xs text-gray-500 ml-auto">
          {new Date(task.due_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );

  const KanbanColumn = ({
    id,
    title,
    tasks,
    color,
  }: {
    id: string;
    title: string;
    tasks: Task[];
    color: string;
  }) => {
    const { setNodeRef } = useSortable({ id });

    return (
    <div ref={setNodeRef} className="flex-1 min-w-[280px] bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 ${color} rounded-full`}></div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <Badge variant="outline" className="rounded-sm">
            {tasks.length}
          </Badge>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-280px)]">
        <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {tasks.map((task) => (
              <DraggableTaskCard key={task._id} task={task} />
            ))}
          </div>
        </SortableContext>
          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              No tasks
            </div>
          )}
      </ScrollArea>
    </div>
    );
  };

  const allTasks = [...todoTasks, ...inProgressTasks, ...completedTasks];
  const activeTask = activeId ? allTasks.find(t => t._id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 h-full overflow-x-auto pb-4">
        <SortableContext items={['todo', 'in_progress', 'completed']} strategy={verticalListSortingStrategy}>
          <KanbanColumn id="todo" title="To Do" tasks={todoTasks} color="bg-gray-500" />
          <KanbanColumn
            id="in_progress"
            title="In Progress"
            tasks={inProgressTasks}
            color="bg-blue-500"
          />
          <KanbanColumn
            id="completed"
            title="Completed"
            tasks={completedTasks}
            color="bg-emerald-500"
          />
        </SortableContext>
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
