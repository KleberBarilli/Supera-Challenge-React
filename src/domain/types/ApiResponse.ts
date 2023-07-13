import { Transferencia } from "./Transferencia";

export interface ApiResponse {
  transferencias: Transferencia[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  saldoTotal: number;
  saldoNoPeriodo: number;
}
