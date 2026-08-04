import { Link } from "react-router-dom";
import { Home } from "lucide-react";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary-50 dark:bg-slate-950 px-4 transition-colors duration-200">
      <Card className="max-w-md text-center p-8 border border-secondary-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl rounded-2xl">
        <p className="text-6xl font-black text-primary-600 dark:text-primary-400 tracking-tight">404</p>

        <h1 className="mt-4 text-2xl font-bold text-secondary-900 dark:text-white">
          Page Not Found
        </h1>

        <p className="mt-2 text-secondary-500 dark:text-slate-400 text-sm leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>

        <Link to="/dashboard" className="mt-6 inline-block">
          <Button icon={Home}>
            Back to Dashboard
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default NotFound;
