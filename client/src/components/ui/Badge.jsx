const Badge = ({ children, color = "primary" }) => {
    const colors = {
        primary: "bg-primary-100 text-primary-700",

        success: "bg-success-100 text-success-700",

        warning: "bg-warning-100 text-warning-700",

        danger: "bg-danger-100 text-danger-700",

        info: "bg-cyan-100 text-cyan-700",
    };

    return (
        <span
            className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-sm
        font-medium
        ${colors[color]}
      `}
        >
            {children}
        </span>
    );
};

export default Badge;