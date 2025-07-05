import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import QuoteService from "../../services/requisicoes/QuoteService";
import QuoteForm from "../../components/requisicoes/QuoteForm";
import { useDispatch } from "react-redux";
import { setQuote } from "../../redux/slices/requisicoes/quoteSlice";
import { Quote } from "../../models/requisicoes/Quote";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import QuoteItemsTable from "../../components/requisicoes/QuoteItemsTable";


const QuoteDetailPage = () => {
  const dispatch = useDispatch();
  const { id_cotacao } = useParams<{ id_cotacao: string }>();

  const isSupplierRoute = window.location.pathname.includes("/supplier/requisicoes");


  const handleSubmitQuote  = async (e : React.FormEvent<HTMLFormElement>, data : Quote) =>  { 
    e.preventDefault();
      console.log('data: ', data);
      try{ 
        const {
          descricao,
          observacao,
          id_classificacao_fiscal,
          id_condicao_pagamento,
          id_tipo_frete,
          fornecedor,
          valor_frete,
          cnpj_faturamento,
          cnpj_fornecedor,
        } = data;
        const updatedQuote = await QuoteService.update(data.id_cotacao, {
          descricao,
          observacao,
          id_classificacao_fiscal,
          id_condicao_pagamento,
          id_tipo_frete,
          fornecedor,
          valor_frete,
          cnpj_faturamento,
          cnpj_fornecedor,
        });
        dispatch(setQuote(updatedQuote));
        dispatch(setFeedback({ message: `Cotação atualizada com sucesso!`, type: 'success' }));
      }catch(e : any){ 
        dispatch(setFeedback({ message: `Erro ao atualizar cotação : ${e.message}`, type: 'error' }));
      }
  }

  React.useEffect(() => {
    (async () => {
      const data : Quote = await QuoteService.getById(Number(id_cotacao));
      console.log('data: ', data)
      dispatch(setQuote(data));

    })();
  }, [id_cotacao]);
  
  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 2,
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Header Section - Will display quotation title and metadata (e.g., ID, date) */}

      <Grid
        container
        spacing={3}
        sx={{ border: "1px solid", justifyContent: "center" }}
      >
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2}}>
            <QuoteForm onSubmit={handleSubmitQuote}/>
          </Paper>
        </Grid>
        {/* Full Width - Attachments Area - Will load the list of attached files */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography color="primary.main" variant="h6">
              Anexos
            </Typography>
            {/* This area will display the list of attachments for the quotation */}
          </Paper>
        </Grid>
        {/* Left Column - Table Area - Will load the quotation items table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" color="primary.main">
              Items da cotação
            </Typography>
             <QuoteItemsTable />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuoteDetailPage;
