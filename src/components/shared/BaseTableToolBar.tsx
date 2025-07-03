import { Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import BaseSearchInput from "./BaseSearchInput";
import { DebouncedFunc } from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface BaseTableToolBar {
  handleChangeSearchTerm: DebouncedFunc<
    (event: React.ChangeEvent<HTMLInputElement>) => void
  >;
  data?: any;
  columns?: string[];
}

const BaseTableToolBar = ({data, columns, handleChangeSearchTerm } : BaseTableToolBar) => {

  const searchTerm = useSelector((state: RootState) => state.requisitionTable.searchTerm);


  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
        padding: 1,
        backgroundColor: "secondary.light",
        borderRadius: "0",
        border: "1px solid lightgray",
      }}
    >
      <BaseSearchInput showIcon={true} onChange={handleChangeSearchTerm} value={searchTerm} />
    </Box>
  );
};

export default BaseTableToolBar;
