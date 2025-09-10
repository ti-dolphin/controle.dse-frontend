import React, { useState, useRef, useEffect } from "react";
import { FixedSizeList, ListChildComponentProps } from "react-window";

export interface Option {
  id: string | number;
  name: string;
}

export interface OptionsFieldProps {
  label: string;
  options: Option[];
  value?: string | number;
  onChange: (value: string | number) => void;
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  optionHeight?: number;
}

const OptionsField: React.FC<OptionsFieldProps> = ({
  label,
  options,
  value,
  onChange,
  helperText,
  error = false,
  fullWidth = true,
  required = false,
  disabled = false,
  optionHeight = 30,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(
    (opt) => Number(opt.id) === Number(value)
  );

  // filtra opções
  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase())
  );

  // fechar dropdown se clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const Row = ({ index, style }: ListChildComponentProps) => {
    const option = filteredOptions[index];

    return (
      <div
        key={option.id}
        style={style}
        
        onClick={() => {
          onChange(option.id);
          setOpen(false);
        }}
        className="px-2 text-xs cursor-pointer flex items-center hover:bg-blue-100"
      >
        {option.name}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col ${fullWidth ? "w-full" : "w-auto"} relative`}
    >
      <label className="mb-1 text-xs font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      <input
        type="text"
        value={open ? search : selectedOption?.name || ""}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        disabled={disabled}
        onFocus={() => setOpen(true)}

        className={`
          px-3 py-2 rounded-md border text-xs outline-none transition
          ${error ? "border-red-500" : "border-gray-300"}
          focus:ring-1 focus:ring-blue-800
          bg-gray-50
        `}
        placeholder="Selecione..."
      />

      {/* Dropdown */}
      {open && (
        <div
          ref={optionsContainerRef}
          className="w-full absolute mt-16 z-10 bg-white border border-gray-300 rounded-md shadow-lg min-h-[250px] max-h-48 "
        >
          {filteredOptions.length > 0 ? (
            <FixedSizeList
              height={250}
              width="100%"
              itemSize={optionHeight}
              itemCount={filteredOptions.length}
              outerElementType="div"
            >
              {Row}
            </FixedSizeList>
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">
              Nenhuma opção encontrada
            </div>
          )}
        </div>
      )}

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

export default OptionsField;

