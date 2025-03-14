import React, { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TaskColumn from "../Components/Task/TaskColumn";
import useProtectedApi from "../hooks/useProtectedApi";
import useTaskStore from "../store/useTaskStore";

const TasksList = () => {
  const { data, isLoading, isError } = useProtectedApi("tasks", "http://localhost:5001/tasks");
  const { setTasks, tasks, moveTask } = useTaskStore();

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (isError) return <div className="text-center py-10 text-red-600">Error fetching tasks</div>;

  const columnsArray = [
    {
      status: "To Do",
      tasks: tasks.filter((task) => task.status === "To Do"),
      style: "bg-blue-50 border-blue-500 shadow-lg"
    },
    {
      status: "In Progress",
      tasks: tasks.filter((task) => task.status === "In Progress"),
      style: "bg-yellow-50 border-yellow-500 shadow-lg"
    },
    {
      status: "Done",
      tasks: tasks.filter((task) => task.status === "Done"),
      style: "bg-green-50 border-green-500 shadow-lg"
    }
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-start sm:justify-between pb-4 w-full">
            {columnsArray.map((column, i) => (
              <div key={i} className="w-full sm:w-[31%] mb-4 sm:mb-0">
                <TaskColumn
                  status={column.status}
                  tasks={column.tasks}
                  moveTask={moveTask}
                  columnStyle={column.style}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default TasksList;
