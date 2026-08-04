import Badge from "./Badge";
import { getStatusConfig } from "../../utils/statusConfig";

const StatusBadge = ({ statusMap, status, size = "md" }) => {
  const config = getStatusConfig(statusMap, status);

  return (
    <Badge color={config.color} size={size} dot>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
