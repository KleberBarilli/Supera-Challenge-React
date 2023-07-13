export interface Transferencia {
  id: number;
  dataTransferencia: string;
  valor: number;
  tipo: string;
  nomeOperadorTransacao: string;
  conta: {
    idConta: number;
    nomeResponsavel: string;
  };
}
