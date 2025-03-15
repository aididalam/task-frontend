import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import useTaskStore from "../../store/useTaskStore";

// Validation schema for the description field
const validationSchema = Yup.object({
  description: Yup.string().trim().required("Task description is required")
});

const TaskDescriptionField = ({ task, access_token }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateTask } = useTaskStore();

  const handleSave = (values) => {
    updateTask(task.id, { ...task, description: values.description }, access_token);
    setIsEditing(false);
  };

  return (
    <div className="flex justify-between items-center mb-2">
      {isEditing ? (
        <Formik
          initialValues={{
            description: task.description || ""
          }}
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          {({ handleChange, handleBlur, values }) => (
            <Form className="flex items-baseline w-full">
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
              <button type="submit" className="ml-2 text-green-500">
                <FaCheck />
              </button>
              <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
            </Form>
          )}
        </Formik>
      ) : (
        <p className="text-sm text-gray-600 mt-2 cursor-pointer" onClick={() => setIsEditing(true)}>
          {task.description || "Click to add description"}
        </p>
      )}
    </div>
  );
};

export default TaskDescriptionField;
