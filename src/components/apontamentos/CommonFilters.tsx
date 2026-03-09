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
import { Box, Button, TextField, InputAdornment, FormControlLabel, Checkbox } from "@mui/material";
import { debounce } from "lodash";
import SearchIcon from "@mui/icons-material/Search";

interface CommonFiltersProps {
  onFiltersChange?: () => void;
}

const CommonFilters: React.FC<CommonFiltersProps> = ({ onFiltersChange }) => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state: RootState) => state.commonFilters);
  const [initialized, setInitialized] = useState(false);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setCommonSearchTerm(event.target.value));
    },
    [dispatch]
  );

  const debouncedHandleSearchChange = useMemo(
    () => debounce(handleSearchChange, 500),
    [handleSearchChange]
  );

  useEffect(() => {
    return () => {
      debouncedHandleSearchChange.cancel();
    };
  }, [debouncedHandleSearchChange]);

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
        onChange={debouncedHandleSearchChange}
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
      >
        Hoje
      </Button>
      <Button
        sx={{ height: 32, borderRadius: 0, fontSize: 11 }}
        variant="outlined"
        onClick={handlePeriodoAtual}
      >
        Período atual
      </Button>
      <Button
        sx={{ height: 32, borderRadius: 0, fontSize: 11 }}
        variant="outlined"
        onClick={handlePeriodoAnterior}
      >
        Período anterior
      </Button>

      <FormControlLabel
        control={
          <Checkbox
            checked={filters.ATIVOS}
            onChange={handleAtivosChange}
            size="small"
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
