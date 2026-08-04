import { Link } from "react-router-dom";
import { Home } from "lucide-react";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const NotFound = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-md text-center">
        <p className="text-6xl font-bold text-primary-600">404</p>

        <h1 className="mt-4 text-2xl font-semibold text-secondary-900">
          Page Not Found
        </h1>

        <p className="mt-2 text-secondary-500">
          The page you are looking for does not exist or has been moved.
        </p>

        <Link to="/dashboard" className="mt-6 inline-block">
          <Button>
            <Home size={18} className="mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default NotFound;
