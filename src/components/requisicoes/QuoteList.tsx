import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store';
import QuoteService from '../../services/requisicoes/QuoteService';
import { Quote } from '../../models/requisicoes/Quote';
import { Box, IconButton, List, ListItem, ListItemButton, Stack, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils';
import DeleteIcon from '@mui/icons-material/Delete';
import { setFeedback } from '../../redux/slices/feedBackSlice';
import BaseDeleteDialog from '../shared/BaseDeleteDialog';
import { setRefresh } from '../../redux/slices/requisicoes/requisitionItemSlice';
import { setRefreshRequisition } from '../../redux/slices/requisicoes/requisitionSlice';

const QuoteList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const refresh = useSelector((state: RootState) => state.requisitionItem.refresh);
  const permissionToDeleteQuote = Number(user?.PERM_ADMINISTRADOR) === 1 || Number(user?.PERM_COMPRADOR) === 1;
  const requisition = useSelector((state: RootState) => state.requisition.requisition);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [quoteIdToDelete, setQuoteIdToDelete] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleOpenDeleteDialog = (id_cotacao: number) => {
    if(!permissionToDeleteQuote) { 
      dispatch(
        setFeedback({
          message: "Você não tem permissão para excluir a cotação.",
          type: "error",
        })
      );
      return;
    }
    setQuoteIdToDelete(id_cotacao);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteQuote = async (id_cotacao: number) => {
    try {
      await QuoteService.delete(id_cotacao);
      setQuotes(quotes.filter((quote) => quote.id_cotacao !== id_cotacao));
      dispatch(setRefresh(!refresh));
      dispatch(
        setFeedback({
          message: "Cotação excluida com sucesso",
          type: "success",
        })
      );
      setDeleteDialogOpen(false);
      setQuoteIdToDelete(0);
      dispatch(setRefreshRequisition(!refresh));
      dispatch(setRefresh(!refresh));
    } catch (e) {
      dispatch(
        setFeedback({
          message: "Erro ao excluir cotacao",
          type: "error",
        })
      );
    }
  };

  const fetchData = useCallback(async () => { 
    if (requisition) {
      const data = await QuoteService.getMany({ 
        id_requisicao: requisition.ID_REQUISICAO
      });

      const sorted = [...data].sort((a, b) => {
        const valueA = Number(a.valor_total || 0);
        const valueB = Number(b.valor_total || 0);
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      });

      setQuotes(sorted);
    }
  }, [requisition, sortOrder]);

  useEffect(() => { 
    fetchData();
  }, [fetchData]);

  return (
    <Box sx={{ width: "100%", maxWidth: 360, p: 2, maxHeight: 500 }}>
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Ordenar por preço</InputLabel>
          <Select
            value={sortOrder}
            label="Ordenar por preço"
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          >
            <MenuItem value="asc">Menor para Maior</MenuItem>
            <MenuItem value="desc">Maior para Menor</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <nav aria-label="main mailbox folders">
        <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {quotes.map((quote, index) => {
            return (
              <ListItem
                key={index}
                sx={{
                  backgroundColor: "white",
                  borderRadius: 1,
                  elevation: 1,
                  padding: 1,
                }}
                disablePadding
              >
                <ListItemButton
                  onClick={() => navigate(`cotacao/${quote.id_cotacao}`)}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Stack direction="column" gap={1}>
                      <Box>
                        <Stack direction="row" gap={1}>
                          <Typography fontFamily="Poppins" fontWeight="bold">
                            nº da cotação:
                          </Typography>
                          <Typography sx={{ color: "text.secondary" }}>
                            {quote.id_cotacao}
                          </Typography>
                        </Stack>
                        <Stack direction="row" gap={1}>
                          <Typography fontFamily="Poppins" fontWeight="bold">
                            Fornecedor:
                          </Typography>
                          <Typography sx={{ color: "text.secondary" }}>
                            {quote.fornecedor}
                          </Typography>
                        </Stack>
                        <Stack direction="row" gap={1}>
                          <Typography fontFamily="Poppins" fontWeight="bold">
                            Valor da cotação:
                          </Typography>
                          <Typography color="green">
                            {formatCurrency(Number(quote.valor_total || 0))}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                </ListItemButton>
                <IconButton
                  onClick={() => handleOpenDeleteDialog(quote.id_cotacao)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            );
          })}
        </List>
      </nav>
      <BaseDeleteDialog
        open={deleteDialogOpen}
        onConfirm={() => handleDeleteQuote(quoteIdToDelete)}
        onCancel={() => { 
          setDeleteDialogOpen(false);
          setQuoteIdToDelete(0);
        }}
      />
    </Box>
  );
}

export default QuoteList