import React, { TextareaHTMLAttributes, forwardRef } from "react";
import { Box, styled } from "@mui/material";

interface BaseMultilineInputProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  rows?: number;
  className?: string;
}

const StyledTextarea = styled("textarea")(({ theme }) => ({
  width: "100%",
  padding: "8px 12px",
  color: theme.palette.text.secondary,
  fontWeight: 'normal',
  fontSize: "small",
  fontFamily: theme.typography.fontFamily,
  border: `1px solid ${theme.palette.grey[400]}`,
  borderRadius: "4px",
  resize: "vertical",
  "&:hover": {
    borderColor: theme.palette.grey[600],
  },
  "&:focus": {
    outline: "none",
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}30`,
  },
  "&:disabled": {
    backgroundColor: theme.palette.grey[100],
    cursor: "not-allowed",
  },
}));

const Label = styled("label")(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 500,
  color: theme.palette.text.secondary,
  marginBottom: "4px",
}));

const ErrorText = styled("span")(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.error.main,
  marginTop: "4px",
}));

const BaseMultilineInput = forwardRef<
  HTMLTextAreaElement,
  BaseMultilineInputProps
>(({ label, error, rows = 4, className = "", ...props }, ref) => {
  return (
    <Box display="flex" flexDirection="column" width="100%">
      {label && <Label>{label}</Label>}
      <StyledTextarea ref={ref} rows={rows} className={className} {...props} />
      {error && <ErrorText>{error}</ErrorText>}
    </Box>
  );
});

BaseMultilineInput.displayName = "BaseMultilineInput";

export default BaseMultilineInput;
