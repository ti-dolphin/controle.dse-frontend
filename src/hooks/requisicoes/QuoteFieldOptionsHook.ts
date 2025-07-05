import { useCallback, useEffect, useState } from "react";
import { PaymentCondition } from "../../models/requisicoes/PaymentCondition";
import { TaxClassification } from "../../models/requisicoes/TaxClassification";
import { useDispatch } from "react-redux";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import QuoteService from "../../services/requisicoes/QuoteService";
import { Option } from "../../types";


export const useQuoteFieldOptions = ( ) =>  {
    const dispatch = useDispatch();
    const [taxClassificationOptions, setTaxClassificationOptions] = useState<Option[]>([]);
    const [paymentConditionOptions, setPaymentConditionOptions] = useState<Option[]>([]);
    const [shipmentTypeOptions, setShipmentTypeOptions] = useState<Option[]>([]);

    const fetchData = useCallback(async () => { 
        try { 
            const taxClassifications = await QuoteService.getTaxClassifications();
            const paymentConditions = await QuoteService.getPaymentConditions();
            const shipmentTypes = await QuoteService.getShipmentTypes();

            setShipmentTypeOptions(
              shipmentTypes.map((shipmentType: any) => ({
                id: shipmentType.id_tipo_frete,
                name: shipmentType.nome,
              }))
            );

            setTaxClassificationOptions(
              taxClassifications.map((taxClassification: any) => ({
                id: taxClassification.id_classificao_fiscal,
                name: taxClassification.nome,
              }))
            );
            setPaymentConditionOptions(
              paymentConditions.map((paymentCondition: any) => ({
                id: paymentCondition.id_condicao_pagamento,
                name: paymentCondition.nome,
              }))
            );
        } catch (e) { 
            dispatch(setFeedback({ 
                type: 'error',
                message: 'Erro ao buscar classificação fiscal'
            }));
        }
    }, [dispatch]);

    useEffect(() => { 
        fetchData();
    }, [fetchData]);

    return { 
        taxClassificationOptions,
        paymentConditionOptions,
        shipmentTypeOptions
    }

};