import React, { useState, useEffect } from "react";
import { FormFieldProps } from "@/interfaces/forms";

export default function FormField({
  label,
  name,
  type = "text",
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
    if (typeof value === "string") {
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
    <div className={`space-y-2 ${hidden ? "hidden" : "visible"}`}>
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-[var(--primary-gray)]"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {type === "textarea" ? (
        <div className="space-y-2">
          <textarea
            id={name}
            name={name}
            value={value || ""}
            onChange={handleTextareaChange}
            className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-purple)] focus:border-transparent transition-all duration-200 resize-none ${
              disabled
                ? "bg-gray-50 cursor-not-allowed text-gray-500"
                : "bg-white focus:bg-white"
            } ${
              charCount > MAX_LENGTH * 0.9
                ? "border-yellow-400 focus:ring-yellow-400"
                : ""
            }`}
            required={required}
            hidden={hidden}
            disabled={disabled}
            rows={3}
            maxLength={MAX_LENGTH}
            placeholder={
              disabled
                ? `${label} editing disabled`
                : `Enter ${label.toLowerCase()}...`
            }
          />
          <div
            className={`text-xs text-right ${
              charCount > MAX_LENGTH * 0.9
                ? "text-yellow-600 font-medium"
                : "text-[var(--primary-gray)]/60"
            }`}
          >
            {charCount}/{MAX_LENGTH} characters
          </div>
        </div>
      ) : type === "file" ? (
        <input
          type="file"
          id={name}
          name={name}
          accept="image/*"
          onChange={onFileChange || onChange}
          className="hidden"
          required={required}
          hidden={hidden}
          disabled={disabled}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
          className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-purple)] focus:border-transparent transition-all duration-200 ${
            disabled
              ? "bg-gray-50 cursor-not-allowed text-gray-500"
              : "bg-gray-50 focus:bg-white"
          }`}
          required={required}
          hidden={hidden}
          disabled={disabled}
          placeholder={
            disabled
              ? `${label} editing disabled`
              : `Enter ${label.toLowerCase()}...`
          }
        />
      )}
    </div>
  );
}
