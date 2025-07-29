function StockItemAlreadyExistsError(): Error {
  const error = new Error(`Stock item already exists.`);
  error.name = "StockItemAlreadyExistsError";
  return error;
}

export default StockItemAlreadyExistsError;
