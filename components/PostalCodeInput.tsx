import React, { ChangeEvent } from "react";

interface PostalCodeInputProps {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void; // Function to handle search
}

const PostalCodeInput: React.FC<PostalCodeInputProps> = ({
  label,
  value,
  onChange,
  onSearch,
}) => {
  return (
    <div className="mb-4 flex items-center">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300 bg-white"
        placeholder="Enter postal code"
      />
      <button
        className="ml-2 bg-green-500 text-white font-bold px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring focus:border-blue-300"
        onClick={onSearch}
      >
        Search
      </button>
    </div>
  );
};

export default PostalCodeInput;
