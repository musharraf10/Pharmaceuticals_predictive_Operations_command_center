import Button from "../ui/Button";

const PageHeader = ({
    title,
    subtitle,
    buttonText,
    onClick,
}) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">
                    {title}
                </h1>

                <p className="mt-1 text-secondary-500">
                    {subtitle}
                </p>
            </div>

            {buttonText && (
                <Button onClick={onClick}>
                    {buttonText}
                </Button>
            )}
        </div>
    );
};

export default PageHeader;