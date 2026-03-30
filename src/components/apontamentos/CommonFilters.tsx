import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  setCommonSearchTerm,
  setCommonDateFrom,
  setCommonDateTo,
  setCommonAtivos,
  setCommonFilters,
  CommonFilters as CommonFilterValues,
} from "../../redux/slices/apontamentos/commonFiltersSlice";
import { Button, TextField, InputAdornment, FormControlLabel, Checkbox } from "@mui/material";
import { debounce } from "lodash";
import SearchIcon from "@mui/icons-material/Search";

interface CommonFiltersProps {
  onFiltersChange?: () => void;
  onSearch?: (filters: CommonFilterValues) => void;
  disabled?: boolean;
}

const CommonFilters: React.FC<CommonFiltersProps> = ({ onFiltersChange, onSearch, disabled = false }) => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state: RootState) => state.commonFilters);
  const [initialized, setInitialized] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.searchTerm);
  const [dateFromInput, setDateFromInput] = useState(filters.DATA_DE);
  const [dateToInput, setDateToInput] = useState(filters.DATA_ATE);

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

  const dispatchDateFrom = useCallback(
    (value: string) => {
      dispatch(setCommonDateFrom(value));
    },
    [dispatch]
  );

  const dispatchDateTo = useCallback(
    (value: string) => {
      dispatch(setCommonDateTo(value));
    },
    [dispatch]
  );

  const handleSearchInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchInput(value);
      debouncedHandleSearchChange(value);
    },
    [debouncedHandleSearchChange]
  );

  const triggerSearch = useCallback(() => {
    const nextDateFrom = (dateFromInput === "" || dateFromInput.length === 10) ? dateFromInput : filters.DATA_DE;
    const nextDateTo = (dateToInput === "" || dateToInput.length === 10) ? dateToInput : filters.DATA_ATE;
    const nextFilters: CommonFilterValues = {
      searchTerm: searchInput,
      DATA_DE: nextDateFrom,
      DATA_ATE: nextDateTo,
      ATIVOS: filters.ATIVOS,
    };

    debouncedHandleSearchChange.cancel();
    if (searchInput !== filters.searchTerm) {
      dispatchSearchTerm(searchInput);
    }
    if (nextDateFrom !== filters.DATA_DE) {
      dispatchDateFrom(nextDateFrom);
    }
    if (nextDateTo !== filters.DATA_ATE) {
      dispatchDateTo(nextDateTo);
    }
    onSearch?.(nextFilters);
  }, [
    debouncedHandleSearchChange,
    searchInput,
    filters.searchTerm,
    filters.DATA_DE,
    filters.DATA_ATE,
    filters.ATIVOS,
    dateFromInput,
    dateToInput,
    dispatchSearchTerm,
    dispatchDateFrom,
    dispatchDateTo,
    onSearch,
  ]);

  const handleSearchInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        triggerSearch();
      }
    },
    [triggerSearch]
  );

  useEffect(() => {
    return () => {
      debouncedHandleSearchChange.cancel();
    };
  }, [debouncedHandleSearchChange]);

  useEffect(() => {
    setSearchInput(filters.searchTerm);
  }, [filters.searchTerm]);

  useEffect(() => {
    setDateFromInput(filters.DATA_DE);
  }, [filters.DATA_DE]);

  useEffect(() => {
    setDateToInput(filters.DATA_ATE);
  }, [filters.DATA_ATE]);

  const handleDateFromChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setDateFromInput(value);
    },
    []
  );

  const handleDateToChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setDateToInput(value);
    },
    []
  );

  const commitDateFrom = useCallback(() => {
    if ((dateFromInput === "" || dateFromInput.length === 10) && dateFromInput !== filters.DATA_DE) {
      dispatchDateFrom(dateFromInput);
    }
  }, [dateFromInput, dispatchDateFrom, filters.DATA_DE]);

  const commitDateTo = useCallback(() => {
    if ((dateToInput === "" || dateToInput.length === 10) && dateToInput !== filters.DATA_ATE) {
      dispatchDateTo(dateToInput);
    }
  }, [dateToInput, dispatchDateTo, filters.DATA_ATE]);

  const handleDateFromKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        triggerSearch();
      }
    },
    [triggerSearch]
  );

  const handleDateToKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        triggerSearch();
      }
    },
    [triggerSearch]
  );

  const handleAtivosChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setCommonAtivos(e.target.checked));
    },
    [dispatch]
  );

  const handleSearchClick = useCallback(() => {
    triggerSearch();
  }, [triggerSearch]);

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
        value={dateFromInput}
        disabled={disabled}
        onChange={handleDateFromChange}
        onBlur={commitDateFrom}
        onKeyDown={handleDateFromKeyDown}
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
        value={dateToInput}
        disabled={disabled}
        onChange={handleDateToChange}
        onBlur={commitDateTo}
        onKeyDown={handleDateToKeyDown}
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

      <Button
        sx={{ height: 32, borderRadius: 0, fontSize: 11 }}
        variant="contained"
        onClick={handleSearchClick}
        disabled={disabled}
      >
        Pesquisar
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
