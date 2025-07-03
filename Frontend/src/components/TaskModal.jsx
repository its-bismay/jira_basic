import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Dialog } from "@headlessui/react";

const priorities = [
  { label: "Low", value: "Low" },
  { label: "Med", value: "Med" },
  { label: "High", value: "High" },
];

const statuses = [
  { label: "ToDo", value: "ToDo" },
  { label: "In Progress", value: "In Progress" },
  { label: "Done", value: "Done" },
];

const TaskModal = ({
  open,
  onClose,
  onSubmit,
  users = [],
  usersLoading = false,
  initialValues,
  isEdit = false,
}) => {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed inset-0 z-40 flex items-center justify-center"
    >
      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-30"
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-xl shadow-xl p-8 w-full max-w-lg z-50 max-h-[90vh] overflow-y-auto">
            <div className="text-xl font-bold text-blue-700 mb-4">
              {isEdit ? "Update Task" : "Add New Task"}
            </div>
            <Formik
              initialValues={
                initialValues || {
                  title: "",
                  description: "",
                  dueDate: "",
                  priority: "Low",
                  assignees: [],
                  status: "ToDo",
                }
              }
              enableReinitialize
              validate={(values) => {
                const errors = {};
                if (!values.title) errors.title = "Required";
                if (!values.dueDate) errors.dueDate = "Required";
                if (!values.priority) errors.priority = "Required";
                if (!values.assignees || values.assignees.length === 0)
                  errors.assignees = "Select at least one assignee";
                return errors;
              }}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                onSubmit(values);
                setSubmitting(false);
                resetForm();
                onClose();
              }}
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-blue-700 mb-1">Title</label>
                    <Field
                      name="title"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-blue-700 mb-1">
                      Description
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-blue-700 mb-1">
                        Due Date
                      </label>
                      <Field
                        type="date"
                        name="dueDate"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <ErrorMessage
                        name="dueDate"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-blue-700 mb-1">
                        Priority
                      </label>
                      <Field
                        as="select"
                        name="priority"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        {priorities.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="priority"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>
                  {/* Status field for edit mode */}
                  {isEdit && (
                    <div>
                      <label className="block text-blue-700 mb-1">Status</label>
                      <Field
                        as="select"
                        name="status"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        {statuses.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="status"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-blue-700 mb-1">
                      Assignees
                    </label>
                    <input
                      type="text"
                      placeholder="Search user by name or email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <div className="border rounded h-40 overflow-y-auto bg-blue-50 p-2">
                      {usersLoading ? (
                        <div className="text-center text-blue-600 py-4">
                          Loading users...
                        </div>
                      ) : filteredUsers.length === 0 ? (
                        <div className="text-center text-gray-400 py-4">
                          No users found
                        </div>
                      ) : (
                        filteredUsers.map((u) => (
                          <label
                            key={u._id}
                            className="flex items-center gap-2 py-1 px-2 hover:bg-blue-100 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={values.assignees.includes(u._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFieldValue("assignees", [
                                    ...values.assignees,
                                    u._id,
                                  ]);
                                } else {
                                  setFieldValue(
                                    "assignees",
                                    values.assignees.filter(
                                      (id) => id !== u._id
                                    )
                                  );
                                }
                              }}
                            />
                            <span>
                              {u.name}{" "}
                              <span className="text-xs text-gray-500">
                                ({u.email})
                              </span>
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                    <ErrorMessage
                      name="assignees"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                    {/* Show selected users */}
                    {values.assignees && values.assignees.length > 0 && (
                      <div className="mt-2 text-xs text-blue-700">
                        Selected:{" "}
                        {values.assignees
                          .map((id) => {
                            const user = users.find((u) => u._id === id);
                            return user ? user.name : id;
                          })
                          .join(", ")}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                      {isEdit ? "Update Task" : "Add Task"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default TaskModal;
