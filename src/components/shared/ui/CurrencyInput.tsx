import React from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { NumericFormat, NumberFormatValues } from "react-number-format";

export interface CurrencyInputProps {
  label: string;
  value?: number;
  onChange: (value: number) => void;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  size?: "small" | "medium";
  InputLabelProps?: TextFieldProps["InputLabelProps"];
  InputProps?: TextFieldProps["InputProps"];
}

/**
 * CurrencyInput
 *
 * Componente reutilizável para entrada de valores monetários em Real (BRL).
 * Formata automaticamente com prefixo "R$ ", separador de milhares (.) e decimais (,).
 * 
 * @example
 * <CurrencyInput
 *   label="Valor"
 *   value={1234.56}
 *   onChange={(numericValue) => setValor(numericValue)}
 *   required
 * />
 */
const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  value,
  onChange,
  name,
  required = false,
  disabled = false,
  error = false,
  helperText,
  fullWidth = true,
  size = "small",
  InputLabelProps,
  InputProps,
}) => {
  const handleValueChange = (values: NumberFormatValues) => {
    // floatValue é o valor numérico puro, sem formatação
    onChange(values.floatValue || 0);
  };

  return (
    <NumericFormat
      customInput={TextField}
      label={label}
      name={name}
      value={value}
      onValueChange={handleValueChange}
      thousandSeparator="."
      decimalSeparator=","
      prefix="R$ "
      decimalScale={2}
      fixedDecimalScale
      allowNegative={false}
      required={required}
      disabled={disabled}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      size={size}
      variant="outlined"
      InputLabelProps={{
        shrink: true,
        sx: {
          fontSize: 14,
          color: "text.secondary",
          fontWeight: "bold",
        },
        ...InputLabelProps,
      }}
      InputProps={{
        sx: { borderRadius: 0 },
        ...InputProps,
      }}
    />
  );
};

export default CurrencyInput;
