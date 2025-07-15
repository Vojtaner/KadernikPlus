function StockItemAlreadyExistsError(itemName: string): Error {
  const error = new Error(`Stock item with name "${itemName}" already exists.`);
  error.name = "StockItemAlreadyExistsError";
  return error;
}

export default StockItemAlreadyExistsError;
