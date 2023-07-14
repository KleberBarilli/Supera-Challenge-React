export const toCurrency = (value: number) => {
  const amount = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(!isNaN(value) ? value : 0);
  return `${amount}`;
};
