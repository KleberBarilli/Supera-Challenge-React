import { ISearch } from "@/domain/types/Search";
import { Transferencia } from "@/domain/types/Transferencia";
import { getTransferencias } from "@/pages/api";
import React, { useEffect, useState } from "react";

export const TransferenciasTablePagination: any = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [saldoNoPeriodo, setSaldoNoPeriodo] = useState(0);
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [nomeOperadorTransacionado, setNomeOperadorTransacionado] =
    useState("");
  const [transferencias, setTransferencias] = useState<Transferencia[]>([]);
  const [isLast, setIsLast] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { transferencias, totalPages, saldoNoPeriodo, saldoTotal } =
        await getTransferencias({});

      setSaldoNoPeriodo(saldoNoPeriodo);
      setSaldoTotal(saldoTotal);
      setTotalPages(totalPages);
      setTransferencias(transferencias);
      setPageNumber(0);
    };

    fetchData();
  }, []);

  const handlePageChange = async (page: number) => {
    setPageNumber(page);
    if (!isLast) {
      const { transferencias } = await getTransferencias({ pageNumber });
      setTransferencias(transferencias);
    }
  };

  const pageNumbers = [0];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  useEffect(() => {
    handlePageChange(pageNumber);
  }, [pageNumber]);

  const search = async ({
    dataFim,
    dataInicio,
    nomeOperadorTransacao,
  }: ISearch) => {
    const { transferencias, saldoNoPeriodo, saldoTotal, totalPages, last } =
      await getTransferencias({
        dataInicial: dataInicio,
        dataFinal: dataFim,
        nomeOperador: nomeOperadorTransacao,
      });

    setSaldoNoPeriodo(saldoNoPeriodo);
    setSaldoTotal(saldoTotal);
    setTotalPages(totalPages);
    setTransferencias(transferencias);
    setIsLast(last);
    setPageNumber(0);
  };
  useEffect(() => {}, [isLast]);

  return (
    <div>
      <div>
        <label>Data de ínicio</label>
        <input
          type="date"
          className="form-input text-black"
          onChange={(e) => setDataInicio(e.target.value)}
          value={dataInicio}
        />
        <label>Data de Fim</label>
        <input
          type="date"
          className="form-input text-black"
          onChange={(e) => setDataFim(e.target.value)}
          value={dataFim}
        />
        <label>Nome operador transacionado</label>
        <input
          type="text"
          className="form-input text-black"
          onChange={(e) => setNomeOperadorTransacionado(e.target.value)}
          value={nomeOperadorTransacionado}
        />
      </div>
      <div className="flex justify-end w-full my-16">
        <button
          className="py-1.5 flex justify-center items-center px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600"
          onClick={() =>
            search({
              dataInicio: new Date(dataInicio),
              dataFim: new Date(dataFim),
              nomeOperadorTransacao: nomeOperadorTransacionado,
            })
          }
        >
          Pesquisar
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Saldo Total: R${saldoTotal}</th>
            <th>Saldo no período: R${saldoNoPeriodo}</th>
          </tr>
          <tr>
            <th>Dados</th>
            <th>Valentia</th>
            <th>Tipo</th>
            <th>Nome do operador transacionado</th>
          </tr>
        </thead>
        <tbody>
          {transferencias.map((transferencia) => (
            <tr key={transferencia.id}>
              <td>{transferencia.dataTransferencia}</td>
              <td>{transferencia.valor}</td>
              <td>{transferencia.tipo}</td>
              <td>{transferencia.nomeOperadorTransacao}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {pageNumber > 0 && (
          <button onClick={() => setPageNumber(pageNumber - 1)}>{"<"}</button>
        )}
        {pageNumbers.map((item) => (
          <span
            key={item}
            onClick={() => setPageNumber(item)}
            aria-current="page"
            hidden={isLast}
            className={`relative z-10 inline-flex items-center cursor-pointer ${
              pageNumber === item
                ? "bg-black text-white"
                : "bg-white text-black border-white hover:bg-white focus:z-20 focus:outline-offset-0 ring-1 ring-inset ring-white"
            } px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-black`}
          >
            {item + 1}
          </span>
        ))}

        {pageNumber < Math.ceil(transferencias.length / totalPages) && (
          <button onClick={() => setPageNumber(pageNumber + 1)}>{">"}</button>
        )}
      </div>
    </div>
  );
};
