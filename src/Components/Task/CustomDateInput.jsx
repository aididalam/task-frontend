import { format } from "date-fns";

// Custom input component with a clear button
const CustomDateInput = ({ value, onClick, onChange, onClear }) => (
  <div className="relative w-[160px]">
    <input
      type="text"
      value={value || ""}
      onChange={onChange}
      onClick={onClick}
      className="w-full p-3 pl-3 pr-12 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 cursor-pointer"
      placeholder="Select a date"
    />
    {value && (
      <button
        type="button"
        onClick={onClear}
        className="absolute right-5 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full transition"
        aria-label="Clear date"
      >
        &#10005;
      </button>
    )}
  </div>
);

export default CustomDateInput;
