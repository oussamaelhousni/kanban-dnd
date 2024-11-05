import { v4 } from "uuid";
import { useMemo, useState } from "react";
import { Column, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskContainer from "./TaskContainer";
import { createPortal } from "react-dom";

function KabnbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>();
  const [activeTask, setActiveTask] = useState<Task | null>();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  const columnsId = useMemo(() => {
    return columns.map((c) => c.id);
  }, [columns]);

  const createColumn = () => {
    setColumns((prev) => {
      return [...prev, { id: v4(), title: `Column ${prev.length + 1}` }];
    });
  };

  const deleteColumn = (id: string) => {
    setColumns((prev) => prev.filter((col) => col.id !== id));
  };

  const updateTitle = (id: string, title: string) =>
    setColumns((prev) => {
      return prev.map((c) => {
        if (c.id === id) {
          c.title = title;
        }
        return c;
      });
    });

  const onDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === "Column") {
      setActiveColumn(e.active.data.current.column);
    }

    if (e.active.data.current?.type === "Task") {
      setActiveTask(e.active.data.current.task);
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = e;

    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;
    if (activeColumnId === overColumnId) return;
    if (active.data.current?.type !== "Column") return;
    const activeIndex = columns.findIndex((c) => c.id === activeColumnId);
    const overIndex = columns.findIndex((c) => c.id === overColumnId);
    return setColumns(arrayMove(columns, activeIndex, overIndex));
  };

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // dropping a task over a task
    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = active.data.current?.type === "Task";

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        if (tasks[overIndex])
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId as string;
        return tasks;
      });
    }
  };

  const createNewTask = (columnId: string) => {
    setTasks((tasks) => {
      return [...tasks, { columnId, id: v4(), text: "Text" }];
    });
  };

  const updateTask = (id: string, text: string) => {
    setTasks((tasks) => {
      return tasks.map((task) => {
        if (task.id === id) {
          task.text = text;
        }
        return task;
      });
    });
  };

  const deleteTask = (id: string) => {
    setTasks((tasks) => {
      return tasks.filter((t) => t.id !== id);
    });
  };
  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      sensors={sensors}
      onDragOver={onDragOver}
    >
      <div className="min-h-screen w-full flex items-center px-4 overflow-y-hidden overflow-x-auto">
        <div className="flex flex-col gap-4">
          {/*  {activeColumn &&
            createPortal(
              <DragOverlay>
                <ColumnContainer
                  updateTitle={updateTitle}
                  column={activeColumn}
                  deleteColumn={deleteColumn}
                  key={activeColumn.id}
                  tasks={tasks}
                  createNewTask={function (columnId: string): void {
                    throw new Error("Function not implemented.");
                  }}
                  updateTask={function (id: string, text: string): void {
                    throw new Error("Function not implemented.");
                  }}
                  deleteTask={function (id: string): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </DragOverlay>,
              document.body
            )} */}
          {/*  <DragOverlay>
            {activeTask ? (
              <TaskContainer
                task={activeTask}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            ) : null}
          </DragOverlay> */}
          <div className="flex items-start gap-4">
            <SortableContext
              items={columnsId}
              strategy={horizontalListSortingStrategy}
            >
              {columns.map((column) => {
                return (
                  <ColumnContainer
                    tasks={tasks.filter((t) => t.columnId === column.id)}
                    updateTitle={updateTitle}
                    column={column}
                    deleteColumn={deleteColumn}
                    key={column.id}
                    createNewTask={createNewTask}
                    updateTask={updateTask}
                    deleteTask={deleteTask}
                  />
                );
              })}
            </SortableContext>
            <button
              className="bg-zinc-800 px-4 py-2 rounded-md mx-auto active:scale-[99%]"
              onClick={() => createColumn()}
            >
              Add New Column
            </button>
          </div>
        </div>
      </div>
    </DndContext>
  );
}

export default KabnbanBoard;
