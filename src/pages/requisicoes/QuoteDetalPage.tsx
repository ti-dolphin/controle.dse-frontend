import React, { useCallback, useEffect } from "react";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useParams, useSearchParams } from "react-router-dom";
import QuoteService from "../../services/requisicoes/QuoteService";
import QuoteForm from "../../components/requisicoes/QuoteForm";
import { useDispatch, useSelector } from "react-redux";
import { setAccesType, setQuote } from "../../redux/slices/requisicoes/quoteSlice";
import { Quote } from "../../models/requisicoes/Quote";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import QuoteItemsTable from "../../components/requisicoes/QuoteItemsTable";
import QuoteAttachmentList from "../../components/requisicoes/QuoteAttachmentList";
import { Requisition } from "../../models/requisicoes/Requisition";
import { setRequisition } from "../../redux/slices/requisicoes/requisitionSlice";
import RequisitionService from "../../services/requisicoes/RequisitionService";
import { UserService } from "../../services/UserService";
import { RootState } from "../../redux/store";


const QuoteDetailPage = () => {
  const dispatch = useDispatch();
  const { id_cotacao } = useParams<{ id_cotacao: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const user  = useSelector((state : RootState) => state.user.user);
  const domain = window.location.origin;
  
 const accesType = useSelector((state : RootState) => state.quote.accessType);
 const requisition = useSelector((state : RootState) => state.requisition.requisition);
  const handleSubmitQuote  = async (e : React.FormEvent<HTMLFormElement>, data : Quote) =>  { 
      e.preventDefault();
      try{ 
        const updatedQuote = await QuoteService.update(data.id_cotacao, {
          descricao  : data.descricao,
          observacao : data.observacao,
          id_classificacao_fiscal : data.id_classificacao_fiscal,
          id_condicao_pagamento : data.id_condicao_pagamento,
          id_tipo_frete : data.id_tipo_frete,
          fornecedor : data.fornecedor,
          valor_frete : data.valor_frete,
          valor_total : data.valor_total,
          cnpj_faturamento: data.cnpj_faturamento,
          cnpj_fornecedor : data.cnpj_fornecedor,
        });
        dispatch(setQuote(updatedQuote));
        dispatch(setFeedback({ message: `Cotação atualizada com sucesso!`, type: 'success' }));
      }catch(e : any){ 
        dispatch(setFeedback({ message: `Erro ao atualizar cotação : ${e.message}`, type: 'error' }));
      }
  }

  const hanldeCreateSupplierAccess = async ( ) => { 
      try{ 
        const supplierUrl = await UserService.getSupplierAcces(Number(id_cotacao), Number(requisition.ID_REQUISICAO));
        navigator.clipboard.writeText(`${domain}/${supplierUrl}`);
        dispatch(setFeedback({ message: `Acesso ao fornecedor copiado para a rea de transferência!`, type: 'success' }));
        return;
      }catch(e: any){ 
        dispatch(setFeedback({ 
          message: `Erro ao criar acesso ao fornecedor : ${e.message}`, 
          type: 'error'
        }))
      }

  };

  const fetchData = useCallback(async () => {
    try {
      if (token) { 
        window.localStorage.setItem("token", token);
        dispatch(setAccesType("supplier"));
      }
      const data: Quote = await QuoteService.getById(Number(id_cotacao));
      const reqData: Requisition = await RequisitionService.getById(
        Number(data.id_requisicao)
      );
      dispatch(setQuote(data));
      dispatch(setRequisition(reqData));
    } catch (e : any) {
      dispatch(
        setFeedback({
          message: `Erro ao carregar dados da cota o: ${e.message}`,
          type: "error",
        })
      );
    }
  }, [id_cotacao, token, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  
  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 2,
        width: "100%",
        height: "100vh",
        margin: "0 auto",
        backgroundColor: "background",
      }}
    >
      {/* Header Section - Will display quotation title and metadata (e.g., ID, date) */}

      <Grid container spacing={2} sx={{ justifyContent: "center" }}>
        <Grid item xs={12} md={8} sx={{ padding: 2 }}>
          <Paper
            sx={{
              p: 2,
              elevation: 1,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <QuoteForm onSubmit={handleSubmitQuote} />
            {accesType !== "supplier" && (
              <Button onClick={hanldeCreateSupplierAccess}>
                Link de fornecedor
              </Button>
            )}
          </Paper>
        </Grid>
        {/* Full Width - Attachments Area - Will load the list of attached files */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, elevation: 1, borderRadius: 2 }}>
            <Typography color="primary.main" variant="h6">
              Anexos
            </Typography>
            <QuoteAttachmentList id_cotacao={Number(id_cotacao)} />
            {/* This area will display the list of attachments for the quotation */}
          </Paper>
        </Grid>

        {/* Left Column - Table Area - Will load the quotation items table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2, elevation: 1, borderRadius: 2 }}>
            <QuoteItemsTable />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuoteDetailPage;
