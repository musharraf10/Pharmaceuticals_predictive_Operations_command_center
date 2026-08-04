import { cn } from "../../utils/cn";

const PageContainer = ({ children, className = "" }) => {
  return <div className={cn("space-y-8", className)}>{children}</div>;
};

export default PageContainer;
