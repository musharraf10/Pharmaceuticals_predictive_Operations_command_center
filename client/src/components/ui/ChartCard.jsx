import Card, { CardHeader } from "./Card";
import { cn } from "../../utils/cn";

const ChartCard = ({
  title,
  subtitle,
  action,
  children,
  className = "",
  height = "h-72",
}) => {
  return (
    <Card className={cn(className)}>
      <CardHeader title={title} subtitle={subtitle} action={action} />

      <div className={cn("w-full", height)}>{children}</div>
    </Card>
  );
};

export default ChartCard;
