import { cn } from "../../utils/cn";

const Loader = ({ fullScreen = false, size = "md", className = "" }) => {
  const sizes = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-4",
    lg: "h-14 w-14 border-4",
  };

  const spinner = (
    <div
      className={cn(
        "animate-spin rounded-full border-primary-200 border-t-primary-600",
        sizes[size],
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-16">{spinner}</div>;
};

export const Skeleton = ({ className = "" }) => (
  <div
    className={cn("animate-pulse rounded-lg bg-secondary-200", className)}
  />
);

export const PageSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-5 w-72" />
    </div>
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-xl" />
      ))}
    </div>
    <Skeleton className="h-80 rounded-xl" />
  </div>
);

export default Loader;
