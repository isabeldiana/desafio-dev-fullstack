"use client";

import { X } from "lucide-react";
import React, { useRef, useState } from "react";

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  accept?: string;
  disabled?: boolean;
  label?: string;
  description?: string;
  maxFiles?: number;
}

export default function FileUpload({
  files,
  onChange,
  accept = ".pdf",
  disabled = false,
  label = "Clique ou arraste arquivos PDF aqui",
  description = "Suporta PDF de contas de energia",
  maxFiles = 10,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    const updated = [...files, ...newFiles].slice(0, maxFiles);

    onChange(updated);

    e.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="mb-6">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
          disabled ? "opacity-50" : "border-gray-300"
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs text-gray-500 mt-1">{description}</p>

        <input
          type="file"
          ref={inputRef}
          accept={accept}
          multiple
          disabled={disabled}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-100 border border-gray-300 rounded-lg p-3"
            >
              <p className="text-gray-700 truncate">{file.name}</p>
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="ml-4 px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
