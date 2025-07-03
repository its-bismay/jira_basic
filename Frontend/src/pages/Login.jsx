import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Login
        </h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validate={(values) => {
            const errors = {};
            if (!values.email) {
              errors.email = "Required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }
            if (!values.password) {
              errors.password = "Required";
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            setServerError("");
            try {
              const res = await axios.post(
                "https://tasky-backend-4aqd.onrender.com/auth/login",
                values
              );
              if (res.data.success) {
                localStorage.setItem("userName", res.data.name);
                loginContext(
                  { email: res.data.email, name: res.data.name },
                  res.data.jwtToken
                );
                toast.success("Login successful!");
                navigate("/dashboard");
              } else {
                setServerError(res.data.message || "Login failed");
                toast.error(res.data.message || "Login failed");
              }
            } catch (err) {
              const msg = err.response?.data?.message || "Login failed";
              setServerError(msg);
              toast.error(msg);
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-blue-700 mb-1">Email</label>
                <Field
                  type="email"
                  name="email"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label className="block text-blue-700 mb-1">Password</label>
                <Field
                  type="password"
                  name="password"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Login
              </button>
            </Form>
          )}
        </Formik>
        <div className="text-center mt-4">
          <a href="/signup" className="text-blue-600 hover:underline">
            Don't have an account? Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
