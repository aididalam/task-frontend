import { useState } from "react";
import { useDrag } from "react-dnd";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useTaskStore from "../../store/useTaskStore";
import { useAuth } from "../../context/AuthContext";

// Validation schema with Yup
const validationSchema = Yup.object({
  name: Yup.string().trim().required("Task name is required"),
  description: Yup.string().trim(),
  due_date: Yup.date().nullable().required("Due date is required")
});

const TaskCard = ({ task }) => {
  const { deleteTask, updateTask } = useTaskStore();
  const [isEditing, setIsEditing] = useState(false);
  const { authState } = useAuth();

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const handleDelete = () => deleteTask(task.id, authState.access_token);

  return (
    <div
      ref={drag}
      className={`bg-white p-4 rounded-lg shadow-lg transition border-l-4 flex flex-col ${
        isDragging ? "opacity-50" : "opacity-100"
      } ${task.status === "Done" ? "border-green-500" : "border-gray-300"}`}
    >
      {isEditing ? (
        <Formik
          initialValues={{
            name: task.name || "",
            description: task.description || "",
            due_date: task.due_date || ""
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            updateTask(task.id, values, authState.access_token); // Update task with new values
            setIsEditing(false); // Exit editing mode
          }}
        >
          {({ values, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              {/* Name Field */}
              <div className="mb-2">
                <Field
                  type="text"
                  name="name"
                  className="border p-2 rounded w-full"
                  placeholder="Task Name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Description Field */}
              <div className="mb-2">
                <Field
                  as="textarea"
                  name="description"
                  className="border p-2 rounded w-full mt-2"
                  placeholder="Task Description"
                  rows="2"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Due Date Field */}
              <div className="mb-2">
                <Field
                  type="date"
                  name="due_date"
                  className="border p-2 rounded w-full mt-2"
                  value={values.due_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage name="due_date" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Save & Cancel Buttons */}
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <>
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-800 text-lg">{task.name}</h4>
            <div className="flex space-x-2">
              <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-gray-700">
                <FaEdit />
              </button>
              <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
                <FaTrash />
              </button>
            </div>
          </div>

          {/* Description Section */}
          <p className="text-sm text-gray-600 mt-2">{task.description}</p>

          {/* Due Date Section */}
          <p className="text-xs text-gray-500 mt-2">Due: {task.due_date}</p>
        </>
      )}
    </div>
  );
};

export default TaskCard;
