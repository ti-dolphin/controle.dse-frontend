import { Box } from "@mui/material";
import React from "react";
import BaseSearchInput from "./BaseSearchInput";
import { DebouncedFunc } from "lodash";

interface BaseTableToolBar {
  handleChangeSearchTerm: DebouncedFunc<
    (event: React.ChangeEvent<HTMLInputElement>) => void
  >;
  searchValue?: string;
  data?: any;
  columns?: string[];
  children?: React.ReactNode;
  ref?: React.MutableRefObject<any>;
}

const BaseTableToolBar = ({
  handleChangeSearchTerm,
  searchValue,
  children,
}: BaseTableToolBar) => {
  const resolvedValue = typeof searchValue === "string" ? searchValue : undefined;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1,
        padding: 0.5,
        backgroundColor: "white",
        // height: 46,
        borderRadius: "0",
        border: "1px solid lightgray",
      }}
    >
      <BaseSearchInput
        showIcon={true}
        onChange={handleChangeSearchTerm}
        value={resolvedValue}
      />
      {children}
    </Box>
  );
};

export default BaseTableToolBar;
