// components/FormInput.tsx
"use client";

import React from "react";

interface FormInputProps {
  label: string;
  type?: string;
  name: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormInput({
  label,
  type = "text",
  name,
  value,
  placeholder,
  required = false,
  onChange,
}: FormInputProps) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">
        {label}
        {required && " *"}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}
