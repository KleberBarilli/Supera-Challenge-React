import { ISearch } from "@/domain/types/Search";
import { Transferencia } from "@/domain/types/Transferencia";
import { getTransferencias } from "@/pages/api";
import { dateFormatToDDMMYYYY } from "@/utils/dateFormat";
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

  for (let i = 1; i < totalPages; i++) {
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
      <div className="flex justify-between">
        <div className="flex flex-col">
          <label>Data de ínicio</label>
          <input
            type="date"
            className="form-input text-black"
            onChange={(e) => setDataInicio(e.target.value)}
            value={dataInicio}
          />
        </div>

        <div className="flex flex-col">
          <label>Data de Fim</label>
          <input
            type="date"
            className="form-input text-black"
            onChange={(e) => setDataFim(e.target.value)}
            value={dataFim}
            disabled={!dataInicio}
          />
        </div>
        <div className="flex flex-col">
          <label>Nome operador transacionado</label>
          <input
            type="text"
            className="form-input text-black"
            onChange={(e) => setNomeOperadorTransacionado(e.target.value)}
            value={nomeOperadorTransacionado}
          />
        </div>
      </div>
      <div className="flex justify-end w-full my-16">
        <button
          className="py-1.5 flex justify-center items-center px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-400 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600 disabled:bg-gray-400"
          onClick={() =>
            search({
              dataInicio: new Date(dataInicio),
              dataFim: new Date(dataFim),
              nomeOperadorTransacao: nomeOperadorTransacionado,
            })
          }
          disabled={!dataFim && !!dataInicio}
        >
          Pesquisar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="py-3 px-4 text-left border border-black">
                Saldo Total: R${saldoTotal}
              </th>
              <th className="py-3 px-4 text-left border border-black">
                Saldo no período: R${saldoNoPeriodo}
              </th>
            </tr>
            <tr>
              <th className="py-3 px-4 text-left border border-black">Dados</th>
              <th className="py-3 px-4 text-left border border-black">
                Valentia
              </th>
              <th className="py-3 px-4 text-left border border-black">Tipo</th>
              <th className="py-3 px-4 text-left border border-black">
                Nome do operador transacionado
              </th>
            </tr>
          </thead>
          <tbody>
            {transferencias &&
              transferencias.map((transferencia) => (
                <tr key={transferencia.id}>
                  <td className="py-3 px-4 border border-black">
                    {dateFormatToDDMMYYYY(transferencia.dataTransferencia)}
                  </td>
                  <td className="py-3 px-4 border border-black">
                    {transferencia.valor}
                  </td>
                  <td className="py-3 px-4 border border-black">
                    {transferencia.tipo}
                  </td>
                  <td className="py-3 px-4 border border-black">
                    {transferencia.nomeOperadorTransacao}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

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
            className={`relative z-10 inline-flex items-center cursor-pointer px-4 ${
              pageNumber === item
                ? "bg-black text-white"
                : "bg-white text-black border-white hover:bg-white focus:z-20 focus:outline-offset-0 ring-1 ring-inset ring-white"
            } px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-black`}
          >
            {item + 1}
          </span>
        ))}

        {pageNumber <
          Math.ceil(transferencias && transferencias.length / totalPages) && (
          <button
            className="px-2"
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            {">"}
          </button>
        )}
      </div>
    </div>
  );
};
