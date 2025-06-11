import React, { useState, useEffect } from "react";
import { FormFieldProps } from "@/interfaces/forms";

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  hidden = false,
  disabled = false,
  onFileChange,
}: FormFieldProps) {
  const [charCount, setCharCount] = useState(0);
  const MAX_LENGTH = 200;

  useEffect(() => {
    if (typeof value === 'string') {
      setCharCount(value.length);
    }
  }, [value]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_LENGTH) {
      onChange?.(e);
    }
  };

  return (
    <div className={`flex flex-col text-left ${hidden ? 'hidden' : 'visible'}`}>
      <label htmlFor={name} className="mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {type === 'textarea' ? (
        <div className="relative">
          <textarea
            id={name}
            name={name}
            value={value || ''}
            onChange={handleTextareaChange}
            className={`p-2 border rounded w-full ${disabled ? 'cursor-not-allowed' : 'cursor-text'} ${
              charCount > MAX_LENGTH * 0.9 ? 'border-yellow-500' : ''
            }`}
            required={required}
            hidden={hidden}
            disabled={disabled}
            rows={3}
            maxLength={MAX_LENGTH}
          />
          <div className={`text-sm mt-1 text-right ${charCount > MAX_LENGTH * 0.9 ? 'text-yellow-500' : 'text-gray-500'}`}>
            {charCount}/{MAX_LENGTH} characters
          </div>
        </div>
      ) : type === 'file' ? (
        <input
          type="file"
          id={name}
          name={name}
          accept="image/*"
          onChange={onFileChange || onChange}
          className={`p-2 border rounded ${disabled ? 'cursor-not-allowed' : 'cursor-text'}`}
          required={required}
          hidden={hidden}
          disabled={disabled}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={typeof value === 'string' ? value : ''}
          onChange={onChange}
          className={`p-2 border rounded ${disabled ? 'cursor-not-allowed' : 'cursor-text'}`}
          required={required}
          hidden={hidden}
          disabled={disabled}
        />
      )}
    </div>
  );
};