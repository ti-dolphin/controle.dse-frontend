import React from "react";

export interface ElegantInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
}

/**
 * ElegantInput
 *
 * Input estilizado e reutilizável baseado em HTML + Tailwind.
 * Pode ser utilizado em toda a aplicação para padronizar campos de entrada.
 */
const ElegantInput: React.FC<ElegantInputProps> = ({
  label,
  helperText,
  error = false,
  fullWidth = true,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col ${fullWidth ? "w-full" : "w-auto"}`}>
      <label
        htmlFor={props.id}
        className="mb-1 text-xs font-medium text-gray-700"
      >
        {label}
        {props.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        {...props}
        multiple
        className={`px-3 py-2 rounded-md border text-xs outline-none transition 
          ${error ? "border-red-500" : "border-gray-300"}
          focus:ring-1 focus:ring-blue-800
          bg-gray-50
          ${className}
        `}
      />
      {helperText && (
        <span
          className={`mt-1 text-xs ${error ? "text-red-500" : "text-gray-500"}`}
        >
          {helperText}
        </span>
      )}
    </div>
  );
};

export default ElegantInput;

