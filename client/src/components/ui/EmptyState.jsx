const EmptyState = ({ title, description }) => {
    return (
        <div className="rounded-xl border border-dashed border-secondary-300 bg-white p-10 text-center">
            <h2 className="text-xl font-semibold">
                {title}
            </h2>

            <p className="mt-2 text-secondary-500">
                {description}
            </p>
        </div>
    );
};

export default EmptyState;