const Button = ({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    className = "",
    ...props
}) => {
    const variants = {
        primary:
            "bg-primary-600 hover:bg-primary-700 text-white",

        secondary:
            "bg-secondary-100 hover:bg-secondary-200 text-secondary-800",

        success:
            "bg-success-600 hover:bg-success-700 text-white",

        danger:
            "bg-danger-600 hover:bg-danger-700 text-white",

        warning:
            "bg-warning-500 hover:bg-warning-600 text-white",

        outline:
            "border border-primary-600 text-primary-600 hover:bg-primary-50",
    };

    const sizes = {
        sm: "px-3 py-2 text-sm",

        md: "px-4 py-2",

        lg: "px-6 py-3 text-lg",
    };

    return (
        <button
            type={type}
            className={`
        rounded-xl
        font-medium
        transition-all
        duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;