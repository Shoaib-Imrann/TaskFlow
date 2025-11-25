import { Calendar, Flag, User, X, Edit, Trash2, Clock, Plus, Check, ChevronUp, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { CountdownTimer } from "@/components/countdown-timer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
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
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  status: string;
  dueDate?: string;
  category?: string;
}

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  allTasks?: Task[];
  onNavigateTask?: (task: Task) => void;
}

export function TaskDetailsModal({ task, isOpen, onClose, onEdit, onDelete, allTasks = [], onNavigateTask }: TaskDetailsModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [subtasks, setSubtasks] = useState<any[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [loadingSubtasks, setLoadingSubtasks] = useState(false);

  const fetchSubtasks = async () => {
    const taskId = task?._id || task?.id;
    if (!taskId) return;
    setLoadingSubtasks(true);
    try {
      const response = await axiosInstance.get(`/api/tasks/${taskId}/subtasks`);
      setSubtasks(response.data);
    } catch (error) {
      console.error("Failed to fetch subtasks:", error);
    } finally {
      setLoadingSubtasks(false);
    }
  };
  
  useEffect(() => {
    if (task && isOpen) {
      setSubtasks([]);
      setNewSubtaskTitle("");
      fetchSubtasks();
    }
  }, [task, isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      const activeElement = document.activeElement;
      const isTyping = activeElement && (
        activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA"
      );
      
      if (isTyping) return;
      
      const currentTaskIndex = allTasks.findIndex((t) => (t._id || t.id) === (task?._id || task?.id));
      const canNavigateUp = currentTaskIndex > 0;
      const canNavigateDown = currentTaskIndex < allTasks.length - 1;
      
      if (event.key === "ArrowUp" && canNavigateUp) {
        event.preventDefault();
        onNavigateTask?.(allTasks[currentTaskIndex - 1]);
      } else if (event.key === "ArrowDown" && canNavigateDown) {
        event.preventDefault();
        onNavigateTask?.(allTasks[currentTaskIndex + 1]);
      }
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, allTasks, task, onNavigateTask])

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim() || !task?._id) return;
    setIsAddingSubtask(true);
    try {
      await axiosInstance.post(`/api/tasks`, {
        title: newSubtaskTitle,
        parent_task_id: task._id || task.id,
        status: "pending",
        priority: "medium",
        dueDate: task.dueDate,
      });
      setNewSubtaskTitle("");
      toast.success("Subtask added!");
      fetchSubtasks();
    } catch (error) {
      toast.error("Failed to add subtask");
    } finally {
      setIsAddingSubtask(false);
    }
  };

  const handleToggleSubtask = async (subtaskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    
    // Optimistic update
    setSubtasks(prev => prev.map(st => 
      st.id === subtaskId ? { ...st, status: newStatus } : st
    ));
    
    try {
      await axiosInstance.put(`/api/tasks/${subtaskId}`, {
        status: newStatus,
      });
    } catch (error) {
      // Revert on error
      setSubtasks(prev => prev.map(st => 
        st.id === subtaskId ? { ...st, status: currentStatus } : st
      ));
      toast.error("Failed to update subtask");
    }
  };
  
  if (!task || !isOpen) return null;

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDelete?.();
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div className="relative w-full max-w-2xl">
      <div
        className="bg-white rounded-lg w-full min-h-[500px] max-h-[80vh] overflow-y-auto p-4 md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
    {/* Close button - absolute top right */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-lg text-gray-400 hover:text-gray-600 transition-colors border border-gray-200 z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Edit/Delete buttons - absolute top right edge */}
        <div className="absolute top-4 right-4 flex items-center gap-1 z-10">
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-gray-400 hover:text-blue-600 transition-colors p-2"
              title="Edit task"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-gray-400 hover:text-red-600 transition-colors p-2"
              title="Delete task"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 pr-16">
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

          {/* Properties */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }) : 'No due date'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-gray-500" />
              <div>
                <div className="text-xs text-gray-500">Time Left</div>
                <div className="text-sm font-medium">
                  {task.dueDate ? (
                    <CountdownTimer 
                      dueDate={task.dueDate} 
                      isCompleted={task.status === "completed"}
                    />
                  ) : '-'}
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

          {/* Subtasks */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Subtasks</h3>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Add a subtask..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSubtask()}
                className="text-sm"
              />
              <Button
                onClick={handleAddSubtask}
                disabled={isAddingSubtask || !newSubtaskTitle.trim()}
                size="sm"
                className="flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {loadingSubtasks ? (
                <p className="text-xs text-gray-500">Loading subtasks...</p>
              ) : (
                subtasks.map((subtask) => (
                  <motion.div 
                    key={subtask.id} 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => handleToggleSubtask(subtask.id, subtask.status)}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="flex-shrink-0"
                      animate={{
                        scale: subtask.status === "completed" ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-300",
                        subtask.status === "completed" 
                          ? "bg-green-600 border-green-600" 
                          : "border-gray-300"
                      )}>
                        {subtask.status === "completed" && (
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        )}
                      </div>
                    </motion.div>
                    <span className={cn(
                      "text-sm flex-1 transition-all duration-300",
                      subtask.status === "completed" ? "line-through text-gray-500" : "text-gray-900"
                    )}>
                      {subtask.title}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows - Above modal at top left */}
      {allTasks.length > 1 && onNavigateTask && (() => {
        const currentTaskIndex = allTasks.findIndex((t) => (t._id || t.id) === (task?._id || task?.id));
        const canNavigatePrev = currentTaskIndex > 0;
        const canNavigateNext = currentTaskIndex < allTasks.length - 1;
        
        if (!canNavigatePrev && !canNavigateNext) return null;
        
        return (
          <div className="absolute -top-10 left-0 flex gap-2 items-center">
            <div className="flex gap-0">
              {canNavigatePrev && (
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateTask(allTasks[currentTaskIndex - 1]);
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "h-10 w-12 bg-white hover:bg-gray-50 border border-gray-200 flex items-center justify-center",
                    canNavigateNext ? "rounded-l-lg" : "rounded-lg"
                  )}
                  title="Previous task (↑)"
                >
                  <ChevronUp className="h-4 w-4" />
                </motion.button>
              )}
              {canNavigateNext && (
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateTask(allTasks[currentTaskIndex + 1]);
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "h-10 w-12 bg-white hover:bg-gray-50 border border-gray-200 flex items-center justify-center",
                    canNavigatePrev ? "border-l-0 rounded-r-lg" : "rounded-lg"
                  )}
                  title="Next task (↓)"
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.button>
              )}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              {currentTaskIndex + 1}/{allTasks.length}
            </div>
          </div>
        );
      })()}
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
