import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import { debounce } from "lodash";

type Column = {
  field: string;
  headerName?: string;
  flex?: number;
  type?: string;
};

type BaseTableColumnFiltersProps = {
  columns: Column[];
  filters: Record<string, any>;
  handleChangeFilters: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => void;
  handleCleanFilters?: () => void;
  debouncedSetTriggerFetch: () => void;
};

function BaseTableColumnFiltersComponent({
  columns,
  filters,
  handleChangeFilters,
  debouncedSetTriggerFetch,
  handleCleanFilters,
}: BaseTableColumnFiltersProps) {
  const [localFilters, setLocalFilters] = useState<any>({});

  const debouncedSync = useMemo(
    () =>
      debounce((field: string, value: string) => {
        handleChangeFilters(
          { target: { value: value === "" ? '' : value } } as any,
          field
        );
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
        flexDirection: "column",
        gap: 1,
        padding: 0,
      }}
    >
      {handleCleanFilters && (
        <Box
          sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            variant="contained"
            onClick={handleCleanFilters}
            color="primary"
            sx={{ borderRadius: 0,  }}
          >
            Limpar filtros
          </Button>
        </Box>
      )}
      <Stack direction="row" gap={0.2}>
        {columns.map((col) => {
          if (col.field === "actions") {
            return <Box sx={{ flex: col.flex || 1 }} key={col.field}></Box>;
          }

          if (col.type === "date") {
            return (
              <Box
                key={col.field}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: col.flex || 1,
                  minWidth: 0,
                  gap: 0.5,
                }}
              >
                <input
                  type="text"
                  value={localFilters[`${col.field}_from`] || ""}
                  placeholder="De"
                  onChange={(e) => {
                    setLocalFilters((prev: any) => ({
                      ...prev,
                      [`${col.field}`]: e.target.value,
                    }));
                    debouncedSync(`${col.field}`, e.target.value);
                  }}
                  style={{
                    minWidth: 0,
                    width: "100%",
                    borderRadius: "0",
                    height: 25,
                    padding: 4,
                    border: "1px solid lightgray",
                    outline: "none",
                    fontSize: "small",
                  }}
                />
              </Box>
            );
          }

          return (
            <Box
              key={col.field}
              component="form"
              sx={{
                display: "flex",
                flex: col.flex || 0,
                
                height: 25,
                alignItems: "center",
                border: "2px solid",
                borderColor: "lightgray",
                borderRadius: 0,
                padding: 0,
              }}
            >
              <input
                type={col.type || "text"}
                value={localFilters[col.field] || ""}
                placeholder={col.headerName || "Pesquisar..."}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    debouncedSync(
                      col.field,
                      (e.target as HTMLInputElement).value
                    );
                  }
                }}
                onChange={(e) => {
                  setLocalFilters((prev: any) => ({
                    ...prev,
                    [col.field]: e.target.value,
                  }));
                  debouncedSync(col.field, e.target.value);
                }}
                style={{
                  minWidth: 0,
                  width: "100%",
                  borderRadius: "0",
                  height: 20,
                  padding: 4,
                  border: "none",
                  outline: "none",
                  fontSize: "small",
                }}
              />
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}

const BaseTableColumnFilters = React.memo(
  BaseTableColumnFiltersComponent
) as typeof BaseTableColumnFiltersComponent;

export default BaseTableColumnFilters;
