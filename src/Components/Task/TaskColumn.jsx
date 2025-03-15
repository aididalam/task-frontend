import { useDrop } from "react-dnd";
import TaskCard from "./TaskCard";
import { useAuth } from "../../context/AuthContext";

const TaskColumn = ({ status, tasks, updateTask, columnStyle }) => {
  const { authState } = useAuth();

  const [, drop] = useDrop({
    accept: "TASK",
    drop: (item) => updateTask(item.id, { status }, authState.access_token),
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  return (
    <div
      ref={drop}
      className={`flex-shrink-0 w-full sm:w-[100%] min-h-[400px] p-4 sm:p-5 rounded-xl border ${columnStyle} transition-all duration-300`}
    >
      <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-4 text-gray-800">{status}</h3>
      <div className="space-y-2 sm:space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;
