import { QuoteItem } from "../../models/requisicoes/QuoteItem";

export type QuoteCompletionStatus = "em_andamento" | "concluida";

export const QUOTE_STATUS_LABEL: Record<QuoteCompletionStatus, string> = {
  em_andamento: "Em andamento",
  concluida: "Concluída",
};

export const getQuoteCompletionStatus = (
  items: QuoteItem[] = []
): QuoteCompletionStatus => {
  if (items.length === 0) return "em_andamento";
  const allItemsFilled = items.every(
    (item) => Boolean(item.indisponivel) || Number(item.preco_unitario) > 0
  );
  return allItemsFilled ? "concluida" : "em_andamento";
};
