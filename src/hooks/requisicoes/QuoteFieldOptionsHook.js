import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setFeedback } from "../../redux/slices/feedBackSlice";
import QuoteService from "../../services/requisicoes/QuoteService";
export const useQuoteFieldOptions = () => {
    const dispatch = useDispatch();
    const [taxClassificationOptions, setTaxClassificationOptions] = useState([]);
    const [paymentConditionOptions, setPaymentConditionOptions] = useState([]);
    const [shipmentTypeOptions, setShipmentTypeOptions] = useState([]);
    const fetchData = useCallback(async () => {
        try {
            const taxClassifications = await QuoteService.getTaxClassifications();
            const paymentConditions = await QuoteService.getPaymentConditions();
            const shipmentTypes = await QuoteService.getShipmentTypes();
            setShipmentTypeOptions(shipmentTypes.map((shipmentType) => ({
                id: shipmentType.id_tipo_frete,
                name: shipmentType.nome,
            })));
            setTaxClassificationOptions(taxClassifications.map((taxClassification) => ({
                id: taxClassification.id_classificao_fiscal,
                name: taxClassification.nome,
            })));
            setPaymentConditionOptions(paymentConditions.map((paymentCondition) => ({
                id: paymentCondition.id_condicao_pagamento,
                name: paymentCondition.nome,
            })));
        }
        catch (e) {
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
    };
};
