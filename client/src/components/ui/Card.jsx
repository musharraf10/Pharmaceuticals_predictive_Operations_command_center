const Card = ({ children, className = "" }) => {
    return (
        <div
            className={`
        bg-white
        rounded-xl
        shadow-card
        border
        border-secondary-200
        p-6
        ${className}
      `}
        >
            {children}
        </div>
    );
};

export default Card;