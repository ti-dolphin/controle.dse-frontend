import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  setCommonSearchTerm,
  setCommonDateFrom,
  setCommonDateTo,
  setCommonAtivos,
  setCommonFilters,
} from "../../redux/slices/apontamentos/commonFiltersSlice";
import { Button, TextField, InputAdornment, FormControlLabel, Checkbox } from "@mui/material";
import { debounce } from "lodash";
import SearchIcon from "@mui/icons-material/Search";

interface CommonFiltersProps {
  onFiltersChange?: () => void;
  disabled?: boolean;
}

const CommonFilters: React.FC<CommonFiltersProps> = ({ onFiltersChange, disabled = false }) => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state: RootState) => state.commonFilters);
  const [initialized, setInitialized] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.searchTerm);

  const dispatchSearchTerm = useCallback(
    (value: string) => {
      dispatch(setCommonSearchTerm(value));
    },
    [dispatch]
  );

  const debouncedHandleSearchChange = useMemo(
    () => debounce(dispatchSearchTerm, 500),
    [dispatchSearchTerm]
  );

  const handleSearchInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchInput(value);
      debouncedHandleSearchChange(value);
    },
    [debouncedHandleSearchChange]
  );

  const handleSearchInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        debouncedHandleSearchChange.cancel();
        dispatchSearchTerm(searchInput);
      }
    },
    [debouncedHandleSearchChange, dispatchSearchTerm, searchInput]
  );

  useEffect(() => {
    return () => {
      debouncedHandleSearchChange.cancel();
    };
  }, [debouncedHandleSearchChange]);

  useEffect(() => {
    setSearchInput(filters.searchTerm);
  }, [filters.searchTerm]);

  const handleDateFromChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setCommonDateFrom(e.target.value));
    },
    [dispatch]
  );

  const handleDateToChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setCommonDateTo(e.target.value));
    },
    [dispatch]
  );

  const handleAtivosChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setCommonAtivos(e.target.checked));
    },
    [dispatch]
  );

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const handleHoje = useCallback(() => {
    const hoje = formatDate(new Date());
    dispatch(
      setCommonFilters({
        ...filters,
        DATA_DE: hoje,
        DATA_ATE: hoje,
      })
    );
  }, [dispatch, filters]);

  const handlePeriodoAtual = useCallback(() => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    const dataInicio = new Date(ano, mes, 21);
    const dataFim = new Date(ano, mes + 1, 20);

    dispatch(
      setCommonFilters({
        ...filters,
        DATA_DE: formatDate(dataInicio),
        DATA_ATE: formatDate(dataFim),
      })
    );
  }, [dispatch, filters]);

  const handlePeriodoAnterior = useCallback(() => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    const dataInicio = new Date(ano, mes - 1, 21);
    const dataFim = new Date(ano, mes, 20);

    dispatch(
      setCommonFilters({
        ...filters,
        DATA_DE: formatDate(dataInicio),
        DATA_ATE: formatDate(dataFim),
      })
    );
  }, [dispatch, filters]);

  useEffect(() => {
    if (!initialized && !filters.DATA_DE && !filters.DATA_ATE) {
      const hoje = formatDate(new Date());
      dispatch(
        setCommonFilters({
          ...filters,
          DATA_DE: hoje,
          DATA_ATE: hoje,
        })
      );
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange();
    }
  }, [filters, onFiltersChange]);

  return (
    <>
      <TextField
        size="small"
        placeholder="Buscar..."
        value={searchInput}
        disabled={disabled}
        onChange={handleSearchInputChange}
        onKeyDown={handleSearchInputKeyDown}
        sx={{
          width: 200,
          "& .MuiOutlinedInput-root": {
            height: 32,
            fontSize: 12,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 18 }} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        size="small"
        label="De"
        type="date"
        value={filters.DATA_DE}
        disabled={disabled}
        onChange={handleDateFromChange}
        InputLabelProps={{ shrink: true }}
        sx={{
          width: 150,
          "& .MuiOutlinedInput-root": {
            height: 32,
            fontSize: 12,
          },
          "& .MuiInputLabel-root": {
            fontSize: 12,
          },
        }}
      />
      <TextField
        size="small"
        label="Até"
        type="date"
        value={filters.DATA_ATE}
        disabled={disabled}
        onChange={handleDateToChange}
        InputLabelProps={{ shrink: true }}
        sx={{
          width: 150,
          "& .MuiOutlinedInput-root": {
            height: 32,
            fontSize: 12,
          },
          "& .MuiInputLabel-root": {
            fontSize: 12,
          },
        }}
      />

      <Button
        sx={{ height: 32, borderRadius: 0, fontSize: 11 }}
        variant="outlined"
        onClick={handleHoje}
        disabled={disabled}
      >
        Hoje
      </Button>
      <Button
        sx={{ height: 32, borderRadius: 0, fontSize: 11 }}
        variant="outlined"
        onClick={handlePeriodoAtual}
        disabled={disabled}
      >
        Período atual
      </Button>
      <Button
        sx={{ height: 32, borderRadius: 0, fontSize: 11 }}
        variant="outlined"
        onClick={handlePeriodoAnterior}
        disabled={disabled}
      >
        Período anterior
      </Button>

      <FormControlLabel
        control={
          <Checkbox
            checked={filters.ATIVOS}
            onChange={handleAtivosChange}
            size="small"
            disabled={disabled}
          />
        }
        label="Ativos"
        sx={{
          marginLeft: 1,
          "& .MuiFormControlLabel-label": { fontSize: 12 },
        }}
      />
    </>
  );
};

export default CommonFilters;
