import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  Stack,
  Button,
  useTheme,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  setRef,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RequisitionService from "../../services/requisicoes/RequisitionService";
import { setRequisition } from "../../redux/slices/requisicoes/requisitionSlice";
import RequisitionStatusStepper from "../../components/requisicoes/RequisitionStatusStepper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useCallback } from "react";
import RequisitionDetailsTable from "../../components/requisicoes/RequisitionDetailsTable";
import AddIcon from "@mui/icons-material/Add";
import RequisitionAttachmentList from "../../components/requisicoes/RequisitionAttachmentList";
import BaseMultilineInput from "../../components/shared/BaseMultilineInput";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import RequisitionTimeline from "../../components/requisicoes/RequisitionTimeline";
import VisibilityIcon from '@mui/icons-material/Visibility';
import RequisitionItemsTable from "../../components/requisicoes/RequisitionItemsTable";
import { clearNewItems, clearRecentProducts, setAddingProducts, setItemBeingReplaced, setNewItems, setProductSelected, setRefresh, setReplacingItemProduct, setUpdatingRecentProductsQuantity } from "../../redux/slices/requisicoes/requisitionItemSlice";
import ProductsTable from "../../components/requisicoes/ProductsTable";
import RequisitionItemService from "../../services/requisicoes/RequisitionItemService";
import QuoteList from "../../components/requisicoes/QuoteList";
import CloseIcon from '@mui/icons-material/Close';
import { formatCurrency } from "../../utils";
import UpperNavigation from "../../components/shared/UpperNavigation";

const RequisitionDetailPage = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const {addingProducts, updatingRecentProductsQuantity} = useSelector((state: RootState) => state.requisitionItem);
  const {id_requisicao} = useParams();
  const { recentProductsAdded, replacingItemProduct, itemBeingReplaced, productSelected, refresh } = useSelector((state: RootState) => state.requisitionItem);
  const requisition = useSelector((state: RootState) => state.requisition.requisition);
  const [observation, setObservation] = useState('');
  const [editingObservation, setEditingObservation] = useState<boolean>(false);
  const [detailView, setDetailView] = useState<boolean>(false);
  const [quoteListOpen, setQuoteListOpen] = useState<boolean>(false);

  const fetchData = useCallback(async () => { 
    const requisition = await RequisitionService.getById(Number(id_requisicao));
    dispatch(setRequisition(requisition));
    setObservation(requisition.OBSERVACAO);
  }, [id_requisicao, dispatch]);

  const handleChangeObservation = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const {value} = e.target;
    setObservation(value);
  };

  const startObservationEditMode= (e:  React.FocusEvent<HTMLTextAreaElement>) => { 
    const admin = Number(user?.PERM_ADMINISTRADOR) === 1;
    const allowedToEdit = Number(user?.CODPESSOA) === Number(requisition.criado_por);
    const editObservationPermittedForUser = admin || allowedToEdit;
    if (!editObservationPermittedForUser) {
      dispatch(
        setFeedback({
          message: "Você não tem permissão para editar esta observação.",
          type: "error",
        })
      );
      e.target.blur();
      return;
    }
    setEditingObservation(true);
  }

  const handleSaveObservation = async ( ) =>  { 
    try{ 
      const updatedRequisition = await RequisitionService.update((Number(requisition.ID_REQUISICAO)), { 
        OBSERVACAO: observation
      });
      dispatch(setRequisition(updatedRequisition));
      setEditingObservation(false);
      dispatch(setFeedback({ 
        message: 'Observação salva com sucesso',
        type: 'success'
      }));
      return;
    }catch(e){ 
      dispatch(setFeedback({ 
        message: 'Erro ao salvar observação',
        type: 'error'
      }))
    }

  };

  const createItemsFromProducts = async ( ) =>  {
    try{  
      const newItemIds = await RequisitionItemService.createMany(recentProductsAdded, requisition.ID_REQUISICAO);
      dispatch(setFeedback({ 
        message: 'Produtos adicionados com sucesso! Insira as quantidades desejadas',
        type: 'success'
      }));
      dispatch(setNewItems(newItemIds));
      return;
    }catch(e : any){ 
      dispatch(setFeedback({ 
        message: 'Erro ao criar itens da requisição',
        type: 'error'
      }));
    }
  }

  const concludeReplaceItemProduct = async ( ) =>   {
    if(!itemBeingReplaced || !productSelected) return;
    try{ 
      const updatedItem = await RequisitionItemService.update(itemBeingReplaced, {id_produto: productSelected});
      dispatch(setFeedback({
        message: 'Produto substituído com sucesso',
        type: 'success'
      }))
      dispatch(setRefresh(!refresh));
      dispatch(setReplacingItemProduct(false));
      dispatch(setItemBeingReplaced(null))
      dispatch(setProductSelected(null))
    }catch(e) {
      dispatch(setFeedback({
        message: 'Erro ao substituir produto',
        type: 'error'
      }))
    }
  }

  const concludeAddProducts  = async (  ) =>  {
    await createItemsFromProducts();
    dispatch(setUpdatingRecentProductsQuantity(true));
    dispatch(setAddingProducts(false));
    dispatch(clearRecentProducts());
  };

  const concludeUpdateItemsQuantity = () => { 
    setTimeout(() => {
      dispatch(setUpdatingRecentProductsQuantity(false));
      dispatch(clearNewItems());
    }, 1000);
  };

  const handleClose = () => {
    dispatch(setAddingProducts(false));
    dispatch(setReplacingItemProduct(false));
  }

  const handleBack =( ) => {
    navigate("/requisicoes");
  };

  useEffect(() => {
    if (id_requisicao) {
      fetchData();
    }
  }, [id_requisicao, fetchData, refresh]);

  return (
    <Box height="100vh" width="100vw" p={{ xs: 1, md: 0.5 }} bgcolor="background">
      <UpperNavigation handleBack={handleBack} />
      <Grid container spacing={0.6}>
        {/* Header: Título, Projeto, Status Steps */}
        <Grid item xs={12}>
          <Paper sx={{ p: 1.5, mb: 1 }}>
            <Typography
              sx={{ fontSize: "1rem" }}
              fontWeight={600}
              color="primary.main"
            >
              {requisition.ID_REQUISICAO} | {requisition.DESCRIPTION} |{" "}
              {requisition.projeto?.DESCRICAO} 
            </Typography>
            <Box mt={2}>
              {id_requisicao && (
                <RequisitionStatusStepper
                  id_requisicao={Number(id_requisicao)}
                />
              )}
            </Box>
          </Paper>
        </Grid>

        {detailView ? (
          <>
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<VisibilityIcon />}
                onClick={() => setDetailView(false)}
              >
                Ocultar detalhes
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography
                  variant="subtitle1"
                  color="primary.main"
                  fontWeight={500}
                  mb={1}
                >
                  Detalhes da requisição
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <RequisitionDetailsTable requisition={requisition} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, mb: 1 }}>
                <Typography variant="subtitle1" fontWeight={500} mb={1}>
                  Anexos e Links
                </Typography>
                <Divider sx={{ mb: 0.5 }} />
                <RequisitionAttachmentList
                  id_requisicao={Number(id_requisicao)}
                />
              </Paper>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={500} mb={1}>
                  Observação
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    gap: 1,
                  }}
                >
                  <BaseMultilineInput
                    onChange={(e) => handleChangeObservation(e)}
                    onFocus={startObservationEditMode}
                    value={observation || ""}
                  />
                  {editingObservation && (
                    <Button
                      onClick={handleSaveObservation}
                      variant="contained"
                      color="success"
                    >
                      Salvar
                    </Button>
                  )}
                </Box>
              </Paper>
              <Paper sx={{ p: 2 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  justifyContent="flex-end"
                >
                  <Button
                    onClick={() => {
                      dispatch(setAddingProducts(true));
                    }}
                    variant="contained"
                  >
                    <AddIcon />
                    Adicionar Itens
                  </Button>
                  <Button
                    onClick={() => setQuoteListOpen(true)}
                    variant="contained"
                  >
                    Cotações
                  </Button>
                  <Box ml="auto" alignSelf="center">
                    <Typography variant="subtitle2" color="success.main">
                      Custo total:{" "}
                      {formatCurrency(Number(requisition.custo_total || 0))}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight={500} mb={1}>
                  Timeline / Histórico
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Box>
                  <RequisitionTimeline />
                </Box>
              </Paper>
            </Grid>
          </>
        ) : (
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 0.5
            }}
          >
            <Button
              variant="contained"
              startIcon={<VisibilityIcon />}
              onClick={() => setDetailView(true)}
            >
              Ver detalhes
            </Button>
          </Grid>
        )}

        {/* Tabela de Itens */}
        <Grid item xs={12}>
          <Paper sx={{ p: 1 }}>
            <Divider sx={{ mb: 1 }} />
            <Box>
              <RequisitionItemsTable />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {/* Dialog para buscar os produtos, selecionar e adicioná-los aos itens da requisição */}
      <Dialog
        open={addingProducts || replacingItemProduct} //o modal será aberto se estiver sendo feita substituição ou adição de produtos
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        aria-labelledby="add-products-dialog-title"
      >
        <IconButton
          onClick={handleClose}
          color="error"
          sx={{ position: "absolute", top: 0, right: 0 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle id="add-products-dialog-title">
          <Typography variant="h6" fontWeight={600} color="primary.main">
            {" "}
            Adicionar Itens
          </Typography>
        </DialogTitle>
        <DialogContent>
          {(addingProducts || replacingItemProduct) && <ProductsTable />}
        </DialogContent>
        <DialogActions>
          {addingProducts && recentProductsAdded.length > 0 && (
            <Button
              onClick={concludeAddProducts}
              variant="contained"
              color="primary"
              sx={{ textTransform: "none", minWidth: 120 }}
            >
              Concluir
            </Button>
          )}
          {replacingItemProduct && productSelected && (
            <Button
              onClick={concludeReplaceItemProduct}
              variant="contained"
              color="primary"
              sx={{ textTransform: "none", minWidth: 120 }}
            >
              Substituir item
            </Button>
          )}
        </DialogActions>
      </Dialog>
      {/* Dialog para atualizar os novos itens com as quantidades */}
      <Dialog
        open={updatingRecentProductsQuantity}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        aria-labelledby="add-products-dialog-title"
      >
        <DialogTitle id="add-products-dialog-title">
          Insira as quantidades dos produtos adicionados
        </DialogTitle>
        <DialogContent>


          {updatingRecentProductsQuantity && <RequisitionItemsTable />}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={concludeUpdateItemsQuantity}
            variant="contained"
            color="primary"
            sx={{ textTransform: "none", minWidth: 120 }}
          >
            Concluir
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog maxWidth="md" fullWidth open={quoteListOpen}>
        <DialogTitle color="primary.main">
          Cotações desta requisição
        </DialogTitle>
        <DialogContent
          sx={{
            backgroundColor: "background.default",
          }}
        >
          <QuoteList />
          <IconButton
            onClick={() => setQuoteListOpen(false)}
            color="error"
            sx={{ position: "absolute", top: 0, right: 0 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default RequisitionDetailPage;
