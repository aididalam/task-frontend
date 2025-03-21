import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import useTaskStore from "../../store/useTaskStore";
import { useAuth } from "../../context/AuthContext";

const TaskForm = ({ closeModal }) => {
  const { addTask } = useTaskStore();
  const { authState } = useAuth();

  const initialValues = {
    name: "",
    description: "",
    status: "To Do",
    due_date: ""
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Task name is required"),
    description: Yup.string().required("Task description is required"),
    status: Yup.string().required("Task status is required"),
    due_date: Yup.date().required("Due date is required")
  });

  const handleSubmit = async (values, { resetForm }) => {
    await addTask(values, authState.access_token); // Add task to Zustand store
    resetForm(); // Reset form fields after submission
    closeModal(); // Close the modal
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      <Form>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700">Task Name</label>
            <Field type="text" name="name" className="p-3 rounded-md border-2 border-gray-300 w-full" />
            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
          </div>

          <div>
            <label className="block text-gray-700">Description</label>
            <Field
              as="textarea"
              name="description"
              className="p-3 rounded-md border-2 border-gray-300 w-full"
            />
          </div>

          <div>
            <label className="block text-gray-700">Status</label>
            <Field as="select" name="status" className="p-3 rounded-md border-2 border-gray-300 w-full">
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </Field>
          </div>

          <div>
            <label className="block text-gray-700">Due Date</label>
            <Field type="date" name="due_date" className="p-3 rounded-md border-2 border-gray-300 w-full" />
            <ErrorMessage name="due_date" component="div" className="text-red-500 text-sm" />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="py-2 px-4 bg-gray-400 text-white rounded-md"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Add Task
            </button>
          </div>
        </div>
      </Form>
    </Formik>
  );
};

export default TaskForm;
