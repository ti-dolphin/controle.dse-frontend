import React, { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { debounce } from "lodash";

type Column = {
  field: string;
  headerName?: string;
  flex?: number;
  type?: string;
};

type BaseTableColumnFiltersProps<T> = {
  columns: Column[];
  filters: Record<string, any>;
  handleChangeFilters: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => void;
  debouncedSetTriggerFetch: () => void;
};

function BaseTableColumnFiltersComponent<T>({
  columns,
  filters,
  handleChangeFilters,
  debouncedSetTriggerFetch,
}: BaseTableColumnFiltersProps<T>) {
  const [localFilters, setLocalFilters] = useState<Record<string, string>>({
    ...filters,
  });

  const debouncedSync = useMemo(
    () =>
      debounce((field: string, value: string) => {
        handleChangeFilters({ target: { value } } as any, field);
        debouncedSetTriggerFetch();
      }, 600),
    [handleChangeFilters, debouncedSetTriggerFetch]
  );

  useEffect(() => {
    setLocalFilters({ ...filters });
  }, [filters]);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        padding: 1,
        backgroundColor: "white",
      }}
    >
      {columns.map((col) => {
        if (col.field === "actions") {
          return <Box sx={{ flex: col.flex || 1 }} key={col.field}></Box>;
        }
        return (
          <Box
            key={col.field}
            component="form"
            sx={{
              display: "flex",
              flex: col.flex || 1,
              minWidth: 0,
              alignItems: "center",
              border: "2px solid",
              borderColor: "lightgray",
              
              borderRadius: 2,
              padding: 0.2,
              backgroundColor: "white",
            }}
          >
            <input
              type={col.type || "text"}
              value={localFilters[col.field] || ""}
              placeholder={col.headerName || "Pesquisar..."}
              onChange={(e) => {
                const value = e.target.value;
                setLocalFilters((prev) => ({
                  ...prev,
                  [col.field]: value,
                }));
                // Se o valor for vazio, atualiza global instantaneamente
                if (value === "") {
                  handleChangeFilters(e, col.field);
                  debouncedSetTriggerFetch();
                } else {
                  debouncedSync(col.field, value);
                }
              }}
              style={{
                minWidth: 0,
                width: "100%",
                borderRadius: "0",
                height: 30,
                padding: 6,
                border: "none",
                outline: "none",
                fontSize: "small",
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
}

const BaseTableColumnFilters = React.memo(
  BaseTableColumnFiltersComponent
) as typeof BaseTableColumnFiltersComponent;

export default BaseTableColumnFilters;
