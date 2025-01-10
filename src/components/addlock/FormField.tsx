import React from "react";
import { FormFieldProps } from "@/interfaces/forms";

const FormField: React.FC<FormFieldProps> = ({ label, name, value, onChange, type = 'text', required = false, hidden = false }) => {
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
          value={value}
          onChange={onChange}
          className="p-2 border rounded"
          required={required}
          hidden={hidden}
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
          hidden={hidden}
        />
      )}

    </div>
  )
}

export default FormField;