import { QuoteItem } from "../../models/requisicoes/QuoteItem";

/**
 * O desconto de uma cotação só é aplicado quando todos os itens elegíveis
 * (não marcados como indisponíveis) daquela cotação foram selecionados para
 * a requisição — mesma regra usada pelo backend em
 * `RequisitionUtils.calculateDiscountTotal`.
 */
export const calculateEligibleQuoteDiscount = (
  desconto: number,
  allItems: QuoteItem[],
  selectedItems: QuoteItem[]
): number => {
  const eligibleCount = allItems.filter((item) => !item.indisponivel).length;
  if (eligibleCount === 0 || selectedItems.length !== eligibleCount) {
    return 0;
  }
  return Number(desconto || 0);
};
