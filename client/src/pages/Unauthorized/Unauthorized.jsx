import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const Unauthorized = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary-100 px-4">
      <Card className="max-w-md text-center">
        <ShieldAlert size={48} className="mx-auto text-amber-500" />

        <h1 className="mt-4 text-2xl font-semibold text-secondary-900">
          Access Denied
        </h1>

        <p className="mt-2 text-secondary-500">
          You do not have permission to view this page. Contact your
          administrator if you believe this is an error.
        </p>

        <Link to="/dashboard" className="mt-6 inline-block">
          <Button>Go to Dashboard</Button>
        </Link>
      </Card>
    </div>
  );
};

export default Unauthorized;
