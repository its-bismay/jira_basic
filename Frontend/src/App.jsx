import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function PrivateRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  return token ? children : <Navigate to="/login" replace />;
}

const AppLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <div className="flex-1 pt-16">{children}</div>
    <Footer />
  </div>
);

const App = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AppLayout>
            <Login />
          </AppLayout>
        }
      />
      <Route
        path="/signup"
        element={
          <AppLayout>
            <Signup />
          </AppLayout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
