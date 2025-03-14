import React, { useState, useEffect, useRef } from "react";

const CustomDropdown = ({ buttonText, options, selectedOption, onChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Close the dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Add event listener

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Clean up event listener
    };
  }, []);

  const handleStatusChange = (status) => {
    onChange(status); // Trigger the status change passed as a prop
  };

  // Count how many statuses are selected
  const selectedCount = Object.values(selectedOption).filter(Boolean).length;

  return (
    <div className="relative">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className="p-3 rounded-md border-2 border-gray-300 focus:outline-none flex items-center"
      >
        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">
          {selectedCount}
        </span>{" "}
        {buttonText}
      </button>

      {/* Custom Dropdown */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute bg-white border-2 border-gray-300 rounded-md shadow-lg mt-1 w-[200px] z-10"
        >
          <div className="p-3">
            <div className="flex flex-col space-y-2">
              {options.map((status) => (
                <div key={status} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedOption[status]}
                    onChange={() => handleStatusChange(status)}
                    id={status}
                    className="form-checkbox h-4 w-4 text-blue-500"
                  />
                  <label htmlFor={status} className="ml-2">
                    {status}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
