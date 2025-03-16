import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TaskColumn from "../Components/Task/TaskColumn";
import useTaskStore from "../store/useTaskStore";
import CustomDropdown from "../Components/Universal/CustomDropdown";
import DatePicker from "react-datepicker"; // Importing react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Importing styles
import useTasksLoader from "../hooks/useTasksLoader";
import { format } from "date-fns";
import CustomDateInput from "../Components/Universal/CustomDateInput";
import Modal from "../Components/Universal/Modal";
import TaskForm from "../Components/Task/TaskForm";

const TasksList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState({
    "To Do": true,
    "In Progress": true,
    Done: true
  });

  // Fetch tasks data, now including selectedStatuses in the hook
  const { data, isLoading, isError } = useTasksLoader(
    debouncedSearch,
    startDate,
    endDate,
    selectedStatuses // Pass selectedStatuses here
  );

  const { setTasks, tasks, updateTask } = useTaskStore();

  const handleStatusChange = (status) => {
    setSelectedStatuses((prevStatuses) => ({
      ...prevStatuses,
      [status]: !prevStatuses[status]
    }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms debounce delay

    // Cleanup the timeout on search change
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  if (isError) return <div className="text-center py-10 text-red-600">Error fetching tasks</div>;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
          <div className="mx-auto mb-6 px-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <button
                onClick={openModal}
                className="w-full sm:w-auto py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4 sm:mb-0"
              >
                Add Task
              </button>

              {/* Search Bar */}
              <div className="relative w-full sm:w-[400px]">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full p-3 pl-10 pr-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Filters & Date Pickers */}
              <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0 w-full sm:w-auto">
                <CustomDropdown
                  buttonText="Filter Tasks"
                  options={["To Do", "In Progress", "Done"]}
                  selectedOption={selectedStatuses}
                  onChange={handleStatusChange}
                  className="w-full sm:w-auto"
                />

                <div className="flex flex-row items-center">
                  {/* Start Date Picker */}
                  <div className="w-full sm:w-auto">
                    <DatePicker
                      selected={startDate ? new Date(startDate) : null}
                      onChange={(date) => setStartDate(format(date, "yyyy/MM/dd"))}
                      className="p-3 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                      placeholderText="Select start date"
                      dateFormat="yyyy/MM/dd"
                      customInput={
                        <CustomDateInput
                          onChange={(e) => setStartDate(e.target.value)}
                          value={startDate}
                          onClear={() => setStartDate("")}
                        />
                      }
                    />
                  </div>
                  <span className="mx-2">-</span>
                  {/* End Date Picker */}
                  <div className="w-full sm:w-auto">
                    <DatePicker
                      selected={endDate ? new Date(endDate) : null}
                      onChange={(date) => setEndDate(format(date, "yyyy/MM/dd"))}
                      className="p-3 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                      placeholderText="Select end date"
                      dateFormat="yyyy/MM/dd"
                      customInput={
                        <CustomDateInput
                          onChange={(e) => setEndDate(e.target.value)}
                          value={endDate}
                          onClear={() => setEndDate("")}
                        />
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Task Columns */}
          <div className=" mx-auto">
            <div className="flex flex-wrap justify-start sm:justify-between pb-4 w-full">
              {["To Do", "In Progress", "Done"].map((status, i) => (
                <div
                  key={i}
                  className="w-full sm:w-[32%] mb-4 sm:mb-0" // Fixed width for all columns
                >
                  <TaskColumn
                    status={status}
                    tasks={Array.isArray(tasks) ? tasks.filter((task) => task.status === status) : []} // Ensure tasks is an array
                    updateTask={updateTask}
                    columnStyle={`bg-${
                      status === "To Do" ? "red" : status === "In Progress" ? "blue" : "green"
                    }-50 border-${
                      status === "To Do" ? "red" : status === "In Progress" ? "blue" : "green"
                    }-500 shadow-lg`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DndProvider>

      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        <TaskForm closeModal={closeModal} />
      </Modal>
    </>
  );
};

export default TasksList;
