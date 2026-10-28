const DSE_CODE_PATTERN = /-?\s*DSE\s*(\d+)\s*$/i;
export function formatCardTitle(opp: any) {
  const numero = opp?.adicional?.NUMERO ?? 0;
  const projetoId = numero ? `${opp?.projeto?.ID ?? "-"}.${numero}` : opp?.projeto?.ID ?? "-";
  const nomeFantasia: string = opp?.cliente?.NOMEFANTASIA ?? "-";

  const dseMatch = nomeFantasia.match(DSE_CODE_PATTERN);
  if (dseMatch) {
    const dseCode = dseMatch[1];
    return `DSE${dseCode}-${projetoId} - ${opp?.NOME ?? "-"}`;
  }

  return `${projetoId} - ${nomeFantasia}`;
};