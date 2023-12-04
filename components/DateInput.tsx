import React, { ChangeEvent } from "react";

interface DateInputProps {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const DateInput: React.FC<DateInputProps> = ({ label, value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="date"
        value={value}
        onChange={onChange}
        className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300 bg-white"
      />
    </div>
  );
};

export default DateInput;
