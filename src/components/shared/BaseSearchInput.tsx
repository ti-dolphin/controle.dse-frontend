import SearchIcon from "@mui/icons-material/Search";
import { Box } from "@mui/material";
import { DebouncedFunc } from "lodash";
import React from 'react'

interface BaseSearchInput {
  onChange: DebouncedFunc<(event: React.ChangeEvent<HTMLInputElement>) => void>;
  value?: string;
  label? : string;
  placeholder? : string;
  showIcon? : boolean;
  type? : string;
  styles? : any;
}

const BaseSearchInput = ({ onChange, showIcon, label, placeholder, styles} : BaseSearchInput) => {
  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        alignItems: "center",
        border: "2px solid",
        borderColor: "lightgray",
        borderRadius: 0,
        paddingX: 2,
        backgroundColor: "white",
        ...styles
      }}
    >
      {showIcon && <SearchIcon />}
      <input
        type="text"
        placeholder={placeholder || "Pesquisar..."}
        aria-label={label && label}
        onChange={onChange}
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        style={{
          padding: "8px 12px",
          borderRadius: "4px",
          border: "none",
          fontSize: "1rem",
          outline: "none",
          minWidth: "200px",
        }}
      />
    </Box>
  );
}

export default BaseSearchInput