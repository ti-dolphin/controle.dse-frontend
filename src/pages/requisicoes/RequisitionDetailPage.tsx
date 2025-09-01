import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  Stack,
  Button,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RequisitionService from "../../services/requisicoes/RequisitionService";
import { clearRequisition, setRequisition } from "../../redux/slices/requisicoes/requisitionSlice";
import RequisitionStatusStepper from "../../components/requisicoes/RequisitionStatusStepper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useCallback } from "react";
import RequisitionDetailsTable from "../../components/requisicoes/RequisitionDetailsTable";
import AddIcon from "@mui/icons-material/Add";
import RequisitionAttachmentList from "../../components/requisicoes/RequisitionAttachmentList";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import RequisitionTimeline from "../../components/requisicoes/RequisitionTimeline";
import RequisitionItemsTable from "../../components/requisicoes/RequisitionItemsTable";
import { clearNewItems, clearRecentProducts, setAddingProducts, setItemBeingReplaced, setNewItems, setProductSelected, setRefresh, setReplacingItemProduct, setUpdatingRecentProductsQuantity } from "../../redux/slices/requisicoes/requisitionItemSlice";
import ProductsTable from "../../components/requisicoes/ProductsTable";
import RequisitionItemService from "../../services/requisicoes/RequisitionItemService";
import QuoteList from "../../components/requisicoes/QuoteList";
import CloseIcon from '@mui/icons-material/Close';
import { formatCurrency } from "../../utils";
import UpperNavigation from "../../components/shared/UpperNavigation";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import RequisitionCommentList from "../../components/requisicoes/RequisitionCommentList";

const RequisitionDetailPage = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const {addingProducts, updatingRecentProductsQuantity} = useSelector((state: RootState) => state.requisitionItem);
  const {id_requisicao} = useParams();
  const { recentProductsAdded, replacingItemProduct, itemBeingReplaced, productSelected, refresh } = useSelector((state: RootState) => state.requisitionItem);
  const {requisition, refreshRequisition} = useSelector((state: RootState) => state.requisition);
  const [quoteListOpen, setQuoteListOpen] = useState<boolean>(false);
  const [fullScreenItems, setFullScreenItems] = useState<boolean>(false);
  const fullScreenItemsTableContainer = useRef<HTMLDivElement>(null);
  
  const fetchData = useCallback(async () => { 
    const requisition = await RequisitionService.getById(Number(id_requisicao));
    dispatch(setRequisition(requisition));
  }, [id_requisicao, dispatch]);

  // const handleChangeObservation = (e: ChangeEvent<HTMLTextAreaElement>) => {
  //   const {value} = e.target;
  //   setObservation(value);
  // };

  // const startObservationEditMode= (e:  React.FocusEvent<HTMLTextAreaElement>) => { 
  //   const admin = Number(user?.PERM_ADMINISTRADOR) === 1;
  //   const allowedToEdit = Number(user?.CODPESSOA) === Number(requisition.criado_por);
  //   const editObservationPermittedForUser = admin || allowedToEdit;
  //   if (!editObservationPermittedForUser) {
  //     dispatch(
  //       setFeedback({
  //         message: "Você não tem permissão para editar esta observação.",
  //         type: "error",
  //       })
  //     );
  //     e.target.blur();
  //     return;
  //   }
  //   setEditingObservation(true);
  // }

  // const handleSaveObservation = async ( ) =>  { 
  //   try{ 
  //     const updatedRequisition = await RequisitionService.update((Number(requisition.ID_REQUISICAO)), { 
  //       OBSERVACAO: observation
  //     });
  //     dispatch(setRequisition(updatedRequisition));
  //     setEditingObservation(false);
  //     dispatch(setFeedback({ 
  //       message: 'Observação salva com sucesso',
  //       type: 'success'
  //     }));
  //     return;
  //   }catch(e){ 
  //     dispatch(setFeedback({ 
  //       message: 'Erro ao salvar observação',
  //       type: 'error'
  //     }))
  //   }

  // };

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
      await RequisitionItemService.update(itemBeingReplaced, {id_produto: productSelected});
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
    dispatch(clearRequisition());
  };

  const shouldShowAddItemsButton = ( ) => { 
    return (
      user?.PERM_COMPRADOR ||
      (Number(requisition.criado_por?.CODPESSOA) === Number(user?.CODPESSOA) &&
        requisition.status?.nome === "Em edição")
    );
  }

  useEffect(() => {
    if (id_requisicao) {
      fetchData();
    }
  }, [id_requisicao, fetchData, refreshRequisition]);

  return (
    <Box
      height="100vh"
      width="98vw"
      p={{
        xs: 1,
        md: 0.5,
      }}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "auto",
      }}
      bgcolor="background"
    >
      <UpperNavigation handleBack={handleBack}>
        <Typography
          sx={{  
            fontSize: {
              xs: "0.8rem",
              sm: "1.2rem",
            },
          }}
          fontWeight={600}
          color="primary.main"
        >
          {requisition.ID_REQUISICAO} | {requisition.DESCRIPTION} |{" "}
          {requisition.projeto?.DESCRICAO}
        </Typography>
      </UpperNavigation>
      <Grid container spacing={0.6}>
        {/* Header: Título, Projeto, Status Steps */}
        <Grid item xs={12}>
          <Paper>
            <Box sx={{ p: 1 }}>
              {id_requisicao && (
                <RequisitionStatusStepper
                  id_requisicao={Number(id_requisicao)}
                />
              )}
            </Box>
          </Paper>
        </Grid>
        {/* Detalhes da requisição */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 1 }}>
            <Typography
              variant="subtitle1"
              color="primary.main"
              fontWeight={500}
              mb={0.5}
            >
              Detalhes da requisição
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <RequisitionDetailsTable requisition={requisition} />
          </Paper>
        </Grid>
        {/* Anexos, Comentários e Adicionar Itens */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={1}>
            {/* Comentários */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 1,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="subtitle1"
                  color="primary.main"
                  fontWeight={500}
                  mb={0.5}
                >
                  Comentários
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Box
                  sx={{
                    flex: 1,
                    maxHeight: 140,
                    overflowY: "auto",
                  }}
                >
                  <RequisitionCommentList />
                </Box>
              </Paper>
            </Grid>

            {/* Anexos */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 1,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="subtitle1"
                  color="primary.main"
                  fontWeight={500}
                  mb={0.5}
                >
                  Anexos e Links
                </Typography>
                <Divider />
                <Box sx={{ flex: 1, overflowY: "auto" }}>
                  <RequisitionAttachmentList
                    id_requisicao={Number(id_requisicao)}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Ações */}
            <Grid item xs={12}></Grid>
          </Grid>
        </Grid>

        {/* Timline/Histórico */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 1 }}>
            <Typography
              variant="subtitle1"
              color="primary.main"
              fontWeight={500}
              mb={0}
            >
              Timeline / Histórico
            </Typography>
            <Divider />
            <Box>
              <RequisitionTimeline />
            </Box>
          </Paper>
        </Grid>

        {/* Tabela de Itens */}
        <Grid
          item
          xs={12}
          sx={{
            minHeight: {
              xs: 800,
              md: 400,
            },
          }}
        >
          <Paper sx={{ p: 1 }}>
            <Stack direction="row" gap={2}>
              {/* Tela cheia */}
              <IconButton onClick={() => setFullScreenItems(true)}>
                <FullscreenIcon />
              </IconButton>
              {/* Adicionar itens */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems="center"
              >
                {shouldShowAddItemsButton() && (
                  <Button
                    onClick={() => dispatch(setAddingProducts(true))}
                    variant="contained"
                    size="small"
                  >
                    <AddIcon fontSize="small" />
                    Adicionar Itens
                  </Button>
                )}
                <Button
                  onClick={() => setQuoteListOpen(true)}
                  variant="contained"
                  size="small"
                >
                  Cotações
                </Button>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }} ml="auto">
                  <Typography variant="subtitle2" color="primary.main">
                     Itens:{" "}
                    {formatCurrency(Number(requisition.custo_total_itens || 0))} |
                  </Typography>
                  <Typography variant="subtitle2" color="primary.main">
                     Fretes:{" "}
                    {formatCurrency(Number(requisition.custo_total_frete || 0))} |
                  </Typography>
                  <Typography variant="subtitle2" color="success.main">
                    Custo total:{" "}
                    {formatCurrency(Number(requisition.custo_total || 0))}
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            <Divider sx={{ mb: 1 }} />
            <Box>
              <RequisitionItemsTable hideFooter={false} tableMaxHeight={400} />
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
          {updatingRecentProductsQuantity && (
            <RequisitionItemsTable hideFooter={false} />
          )}
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
      {/* Dialog da lista de cotações */}
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

      {/* Dialog tela cheia items */}
      <Dialog
        fullScreen
        open={fullScreenItems}
        onClose={() => setFullScreenItems(false)}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <DialogTitle sx={{ maxHeight: 60 }}>
          <Stack direction="row" alignItems="center" gap={2}>
            <Typography fontSize="normal" color="primary.main" gutterBottom>
              Itens
            </Typography>
            <Button
              variant="contained"
              color="error"
              sx={{ fontSize: "small" }}
              onClick={() => setFullScreenItems(false)}
            >
              Fechar
            </Button>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems="center"
            >
              {shouldShowAddItemsButton() && (
                <Button
                  onClick={() => dispatch(setAddingProducts(true))}
                  variant="contained"
                  size="small"
                >
                  <AddIcon fontSize="small" />
                  Adicionar Itens
                </Button>
              )}
              <Button
                onClick={() => setQuoteListOpen(true)}
                variant="contained"
                size="small"
              >
                Cotações
              </Button>
              <Box ml="auto">
                <Typography variant="subtitle2" color="success.main">
                  Custo total:{" "}
                  {formatCurrency(Number(requisition.custo_total || 0))}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </DialogTitle>

        <DialogContent
          ref={fullScreenItemsTableContainer}
          sx={{ background: "background.default" }}
        >
          <RequisitionItemsTable
            hideFooter={false}
            tableMaxHeight={
              (fullScreenItemsTableContainer.current?.offsetHeight || 0) - 60
            }
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default RequisitionDetailPage;
