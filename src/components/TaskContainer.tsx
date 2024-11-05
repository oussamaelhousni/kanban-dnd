import { useState } from "react";
import { Task } from "../types";
import { FaRegTrashAlt } from "react-icons/fa";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
function TaskContainer({
  task,
  updateTask,
  deleteTask,
}: {
  task: Task;
  updateTask: (id: string, text: string) => void;
  deleteTask: (id: string) => void;
}) {
  const [editMode, setEditMode] = useState(false);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div
      style={style}
      className={`w-full p-2 bg-zinc-700 min-h-12 flex gap-3 items-center rounded-md ${
        isDragging && "border border-rose-500 z-50"
      }`}
      {...attributes}
      {...listeners}
      ref={setNodeRef}
    >
      {!editMode && (
        <p className="flex-1" onClick={() => setEditMode(true)}>
          {task.text}
        </p>
      )}
      {editMode && (
        <textarea
          className="flex-1  outline-none rounded-md bg-transparent min-h-12 border border-rose-500 p-2"
          value={task.text}
          onChange={(e) => {
            updateTask(task.id, e.target.value);
          }}
          autoFocus
          onBlur={() => setEditMode(false)}
        />
      )}
      <button onClick={() => deleteTask(task.id)}>
        <FaRegTrashAlt />
      </button>
    </div>
  );
}

export default TaskContainer;
