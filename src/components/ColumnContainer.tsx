import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Column, Task } from "../types";
import { FaRegTrashCan } from "react-icons/fa6";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import TaskContainer from "./TaskContainer";

function ColumnContainer({
  column,
  deleteColumn,
  updateTitle,
  tasks,
  createNewTask,
  updateTask,
  deleteTask,
}: {
  column: Column;
  deleteColumn: (id: string) => void;
  updateTitle: (id: string, title: string) => void;
  tasks: Task[];
  createNewTask: (columnId: string) => void;
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
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col w-[350px]
  min-h-[500px] bg-zinc-900 rounded-lg p-2 ${
    isDragging && "border border-rose-500"
  }`}
    >
      <div
        className="p-2 bg-zinc-800 flex gap-4 items-center justify-between rounded-lg"
        onClick={() => setEditMode(true)}
      >
        <div>{tasks.length}</div>
        <div {...attributes} {...listeners} className="flex flex-1">
          {!editMode && column.title}
          {editMode && (
            <input
              value={column.title}
              onChange={(e) => updateTitle(column.id, e.target.value)}
              autoFocus
              className="bg-transparent flex-1 outline-none border border-rose-500 p-1 rounded-md"
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={() => {
            deleteColumn(column.id);
            console.log("clicked");
          }}
        >
          <FaRegTrashCan />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-3 my-4">
        <SortableContext items={tasks.map((t) => t.id)}>
          {tasks.map((task) => {
            return (
              <TaskContainer
                key={task.id}
                task={task}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            );
          })}
        </SortableContext>
      </div>

      <div className="bg-zinc-800 p-2 rounded-md">
        <button
          className="flex-1 flex items-center gap-2 w-full"
          onClick={() => createNewTask(column.id)}
        >
          <IoAddCircleOutline /> <span>Add task</span>
        </button>
      </div>
    </div>
  );
}

export default ColumnContainer;
