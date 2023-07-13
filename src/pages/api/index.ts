import { ApiResponse } from "@/domain/types/ApiResponse";
import { dateFormat } from "@/utils/dateFormat";
import { isValidDate } from "@/utils/isValidDate";

interface IGetTransferencia {
  nomeOperador?: string;
  dataInicial?: Date;
  dataFinal?: Date;
  pageSize?: number;
  pageNumber?: number;
}

export const getTransferencias = async ({
  nomeOperador,
  dataInicial,
  dataFinal,
  pageNumber,
  pageSize,
}: IGetTransferencia) => {
  let apiUrl = "http://localhost:8080/api/transferencias";

  const queryParams = [];

  if (nomeOperador && nomeOperador.length > 0) {
    console.log("OPERADOR");
    queryParams.push(`nomeOperador=${encodeURIComponent(nomeOperador)}`);
  }

  if (dataInicial && isValidDate(dataInicial)) {
    queryParams.push(
      `dataInicial=${encodeURIComponent(dateFormat(dataInicial))}`
    );
  }

  if (dataFinal && isValidDate(dataFinal)) {
    queryParams.push(`dataFinal=${encodeURIComponent(dateFormat(dataFinal))}`);
  }

  if (pageNumber) {
    queryParams.push(`pageNumber=${pageNumber}`);
  }

  if (pageSize) {
    queryParams.push(`pageSize=${pageSize}`);
  }

  if (queryParams.length > 0) {
    apiUrl += `?${queryParams.join("&")}`;
  }

  const response = await fetch(apiUrl);
  const json = await response.json();

  const {
    transferencias,
    totalElements,
    totalPages,
    saldoNoPeriodo,
    saldoTotal,
    last,
  } = json as ApiResponse;

  return {
    transferencias,
    totalElements,
    totalPages,
    saldoNoPeriodo,
    saldoTotal,
    last,
  };
};
