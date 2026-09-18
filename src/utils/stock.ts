export const INFINITE_STOCK_QUANTITY = 99999;

export const hasInfiniteStock = (stockQuantity: unknown): boolean =>
  Number(stockQuantity) === INFINITE_STOCK_QUANTITY;

export const getVisibleStockQuantity = (
  stockQuantity: unknown,
  displayedQuantity: unknown,
  isAdministrator: boolean
): number => {
  if (hasInfiniteStock(stockQuantity)) {
    return isAdministrator ? INFINITE_STOCK_QUANTITY : 0;
  }

  return Number(displayedQuantity || 0);
};
