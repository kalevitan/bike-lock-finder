import React from "react";
import { FormFieldProps } from "@/src/interfaces/forms";

const FormField: React.FC<FormFieldProps> = ({ label, name, value, onChange, type = 'text', required = false }) => {
  return (
    <div className="flex flex-col text-left">
      <label htmlFor={name} className="mb-2">{label}</label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="p-2 border rounded"
          required={required}
        ></textarea>
        ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="p-2 border rounded"
          required={required}
        />
      )}

    </div>
  )
}

export default FormField;