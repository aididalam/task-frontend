import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import useTaskStore from "../../store/useTaskStore";

// Validation schema for the due date field
const validationSchema = Yup.object({
  due_date: Yup.date().nullable().required("Due date is required")
});

const TaskDueDateField = ({ task, access_token }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateTask } = useTaskStore();
  const handleSave = (values) => {
    updateTask(task.id, { ...task, due_date: values.due_date }, access_token);
    setIsEditing(false);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  return (
    <div className="flex justify-between items-center mb-2">
      {isEditing ? (
        <Formik
          initialValues={{
            due_date: formatDate(task.due_date) || ""
          }}
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          {({ handleChange, handleBlur, values }) => (
            <Form className="flex items-center w-full">
              <Field
                type="date"
                name="due_date"
                className="border p-2 rounded w-full mt-2"
                value={values.due_date}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <button type="submit" className="ml-2 text-green-500">
                <FaCheck />
              </button>
              <ErrorMessage name="due_date" component="div" className="text-red-500 text-sm mt-1" />
            </Form>
          )}
        </Formik>
      ) : (
        <p className="text-xs text-gray-500 mt-2 cursor-pointer" onClick={() => setIsEditing(true)}>
          Due: {formatDate(task.due_date) || "Click to add due date"}
        </p>
      )}
    </div>
  );
};

export default TaskDueDateField;
