export const formatCurrency = (amount, currency = "INR") => {
  if (amount == null || Number.isNaN(Number(amount))) return "—";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (value) => {
  if (value == null || Number.isNaN(Number(value))) return "—";

  return new Intl.NumberFormat("en-IN").format(value);
};
