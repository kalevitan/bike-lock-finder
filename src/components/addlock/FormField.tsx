import React from "react";
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
  onFileChange
}: FormFieldProps) {
  return (
    <div className={`flex flex-col text-left ${hidden ? 'hidden' : 'visible'}`}>
      <label htmlFor={name} className="mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value || ''}
          onChange={onChange}
          className="p-2 border rounded"
          required={required}
          hidden={hidden}
          disabled={disabled}
        />
      ) : type === 'file' ? (
        <input
          type="file"
          id={name}
          name={name}
          accept="image/*"
          onChange={onFileChange || onChange}
          className="p-2 border rounded"
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
          className="p-2 border rounded"
          required={required}
          hidden={hidden}
          disabled={disabled}
        />
      )}
    </div>
  );
};