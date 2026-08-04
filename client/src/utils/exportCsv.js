const getValue = (row, key) =>
  key.split(".").reduce((value, part) => value?.[part], row);

const escapeCell = (value) => {
  if (value === null || value === undefined) return "";
  const text =
    value instanceof Date
      ? value.toISOString()
      : typeof value === "object"
        ? JSON.stringify(value)
        : String(value);

  return `"${text.replaceAll('"', '""')}"`;
};

export const exportCsv = (filename, rows = [], columns = []) => {
  const headers = columns.map((column) => escapeCell(column.header));
  const body = rows.map((row) =>
    columns.map((column) => escapeCell(getValue(row, column.key))).join(","),
  );

  const blob = new Blob([[headers.join(","), ...body].join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
