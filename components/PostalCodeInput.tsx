import React, { ChangeEvent } from "react";

interface PostalCodeInputProps {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const PostalCodeInput: React.FC<PostalCodeInputProps> = ({
  label,
  value,
  onChange,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300 bg-white"
        placeholder="Enter postal code"
      />
    </div>
  );
};

export default PostalCodeInput;
