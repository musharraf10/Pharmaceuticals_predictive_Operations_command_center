import { Link } from "react-router-dom";
import { ArrowLeft, ShieldAlert } from "lucide-react";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const Unauthorized = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary-50 dark:bg-slate-950 px-4 transition-colors duration-200">
      <Card className="max-w-md text-center p-8 border border-secondary-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl rounded-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 dark:text-amber-400">
          <ShieldAlert size={36} />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-secondary-900 dark:text-white">
          Access Denied
        </h1>

        <p className="mt-2 text-secondary-500 dark:text-slate-400 text-sm leading-relaxed">
          You do not have permission to view this page. Contact your
          administrator if you believe this is an error.
        </p>

        <Link to="/dashboard" className="mt-6 inline-block">
          <Button icon={ArrowLeft}>Go to Dashboard</Button>
        </Link>
      </Card>
    </div>
  );
};

export default Unauthorized;
