import { useDrag } from "react-dnd";

const TaskCard = ({ task }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  return (
    <div
      ref={drag}
      className={`bg-white p-4 rounded-lg shadow-lg transition border-l-4 ${
        isDragging ? "opacity-50" : "opacity-100"
      } ${task.status === "Done" ? "border-green-500" : "border-gray-300"}`}
    >
      <h4 className="font-semibold text-gray-800 text-lg">{task.name}</h4>
      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
      <p className="text-xs text-gray-500 mt-2">Due: {task.due_date}</p>
    </div>
  );
};

export default TaskCard;
