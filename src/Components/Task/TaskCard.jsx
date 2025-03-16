import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import useTaskStore from "../../store/useTaskStore";
import TaskDueDateField from "./TaskDueDateField";
import TaskDescriptionField from "./TaskDescriptionField";
import TaskNameField from "./TaskNameField";
import { useDrag } from "react-dnd";

const TaskCard = ({ task }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id }, // Store the task's id in the dragged item
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const { deleteTask } = useTaskStore();
  const { authState } = useAuth();

  const handleDelete = () => deleteTask(task.id, authState.access_token);

  return (
    <div
      ref={drag}
      className={`bg-white p-4 pb-1 rounded-lg shadow-lg transition-all duration-200 ease-in-out border-l-4 flex flex-col relative ${
        task.status === "Done"
          ? "border-green-500"
          : task.status === "To Do"
          ? "border-red-500"
          : "border-blue-500"
      } ${isDragging ? "opacity-50 transform scale-95" : ""}`}
      style={{ cursor: "grab" }} // Set the cursor to grab
    >
      {/* Delete Button */}
      <div className="absolute top-0 right-0 p-2">
        <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
          <FaTrash />
        </button>
      </div>

      {/* Task Fields */}
      <div className="mt-2">
        <TaskNameField task={task} access_token={authState.access_token} />
        <TaskDescriptionField task={task} access_token={authState.access_token} />
        <TaskDueDateField task={task} access_token={authState.access_token} />
      </div>
    </div>
  );
};

export default TaskCard;
