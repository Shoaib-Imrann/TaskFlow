import { Calendar, Flag, User, X, Edit, Trash2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CountdownTimer } from "@/components/countdown-timer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Task {
  _id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: string;
  due_date: string;
  category?: string;
  estimated_hours?: number;
}

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function TaskDetailsModal({ task, isOpen, onClose, onEdit, onDelete }: TaskDetailsModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  if (!task || !isOpen) return null;

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDelete?.();
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {task.title}
              </h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {task.status.replace('_', ' ')}
                </Badge>
                {task.category && (
                  <Badge variant="secondary">{task.category}</Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                  title="Edit task"
                >
                  <Edit className="h-5 w-5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1"
                  title="Delete task"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Properties */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Flag
                className={cn(
                  "w-4 h-4 fill-current",
                  task.priority === "high"
                    ? "text-red-500"
                    : task.priority === "medium"
                      ? "text-amber-500"
                      : "text-green-500"
                )}
              />
              <div>
                <div className="text-xs text-gray-500">Priority</div>
                <div className="text-sm font-medium capitalize">{task.priority}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <div className="text-xs text-gray-500">Due Date</div>
                <div className="text-sm font-medium">
                  {new Date(task.due_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-gray-500" />
              <div>
                <div className="text-xs text-gray-500">Time Left</div>
                <div className="text-sm font-medium">
                  <CountdownTimer 
                    dueDate={task.due_date} 
                    isCompleted={task.status === "completed"}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
              <div
                className="text-sm text-gray-600 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: task.description }}
              />
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
