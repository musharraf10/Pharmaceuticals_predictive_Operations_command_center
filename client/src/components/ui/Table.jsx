const Table = ({ headers = [], children }) => {
    return (
        <div className="overflow-hidden rounded-xl border border-secondary-200 bg-white shadow-card">
            <table className="min-w-full">
                <thead className="bg-secondary-100">
                    <tr>
                        {headers.map((header) => (
                            <th
                                key={header}
                                className="px-6 py-3 text-left text-sm font-semibold text-secondary-700"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>{children}</tbody>
            </table>
        </div>
    );
};

export default Table;