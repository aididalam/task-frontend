import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TaskColumn from "../Components/Task/TaskColumn";
import useTasksLoader from "../hooks/useTasksLoader";
import useTaskStore from "../store/useTaskStore";
import CustomDropdown from "../Components/Task/CustomDropdown";

const TasksList = () => {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useTasksLoader(search);
  const { setTasks, tasks, moveTask } = useTaskStore();
  const [selectedStatuses, setSelectedStatuses] = useState({
    "To Do": true,
    "In Progress": true,
    Done: true
  });

  const handleStatusChange = (status) => {
    setSelectedStatuses((prevStatuses) => ({
      ...prevStatuses,
      [status]: !prevStatuses[status]
    }));
  };

  // Filtered columns based on selected checkboxes
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

  // Apply the selected filters
  const filteredColumns = columnsArray.filter((column) => selectedStatuses[column.status]);

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (isError) return <div className="text-center py-10 text-red-600">Error fetching tasks</div>;

  // Conditionally set width classes based on the number of columns
  const getColumnWidth = (numColumns) => {
    if (numColumns === 3) return "sm:w-[31%]";
    if (numColumns === 2) return "sm:w-[48%]";
    return "sm:w-full";
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto mb-6">
            <div className="flex justify-between items-center">
              {/* Search Bar */}
              <div className="relative w-full sm:w-[300px]">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full p-3 pl-10 pr-4 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <CustomDropdown
                buttonText="Filter Tasks"
                options={["To Do", "In Progress", "Done"]}
                selectedOption={selectedStatuses}
                onChange={handleStatusChange}
              />
            </div>
          </div>

          {/* Task Columns */}
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-start sm:justify-between pb-4 w-full">
              {filteredColumns.map((column, i) => (
                <div key={i} className={`w-full mb-4 sm:mb-0 ${getColumnWidth(filteredColumns.length)}`}>
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
    </>
  );
};

export default TasksList;
