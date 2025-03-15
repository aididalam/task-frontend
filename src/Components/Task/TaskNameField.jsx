import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import useTaskStore from "../../store/useTaskStore";

// Validation schema for the name field
const validationSchema = Yup.object({
  name: Yup.string().trim().required("Task name is required")
});

const TaskNameField = ({ task, access_token }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateTask } = useTaskStore();

  const handleSave = (values) => {
    updateTask(task.id, { ...task, name: values.name }, access_token);
    setIsEditing(false);
  };

  return (
    <div className="flex justify-between items-center mb-2">
      {isEditing ? (
        <Formik
          initialValues={{
            name: task.name || ""
          }}
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          {({ handleChange, handleBlur, values }) => (
            <Form className="flex items-center w-full">
              <Field
                type="text"
                name="name"
                className="border p-2 rounded w-full"
                placeholder="Task Name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <button type="submit" className="ml-2 text-green-500">
                <FaCheck />
              </button>
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
            </Form>
          )}
        </Formik>
      ) : (
        <h4 className="font-semibold text-gray-800 text-lg cursor-pointer" onClick={() => setIsEditing(true)}>
          {task.name}
        </h4>
      )}
    </div>
  );
};

export default TaskNameField;
