import React from "react";
import { useAuth } from "../../dcontext/AuthContext";

const Navbar = () => {
  const { authState, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-2">
      {" "}
      {/* Reduced padding */}
      <div className=" mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-12">
          {" "}
          {/* Reduced height */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile Menu Button */}
          </div>
          <div className="flex-1 flex items-center justify-between sm:justify-start">
            {/* Left Side: User's name */}
            {authState?.user?.name ? (
              <span className="text-white text-lg font-semibold">{authState.user.name}</span>
            ) : (
              <span className="text-white text-lg font-semibold">Guest</span>
            )}
          </div>
          <div className="flex items-center">
            {/* Right Side: Logout Button */}
            {authState && authState.access_token ? (
              <button
                onClick={logout}
                className="ml-4 text-white bg-red-500 hover:bg-red-700 rounded px-4 py-2"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
