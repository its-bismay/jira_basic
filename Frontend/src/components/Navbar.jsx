import React from "react";
import { useAuth } from "../AuthContext";

const Navbar = () => {
  const { token, logout } = useAuth();
  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-white shadow z-20 flex items-center justify-between px-8">
      <div className="text-2xl font-bold text-blue-700 tracking-wide">
        Tasky
      </div>
      {token && (
        <button
          onClick={logout}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
