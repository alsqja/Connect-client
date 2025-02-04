export interface chartType {
  date: string,
  newData: number,
  oldData: number,
  newLabel: string,
  oldLabel: string,
}

export interface getDataType {
  date: string,
  sales: number,
  cumulativeSales: number
}