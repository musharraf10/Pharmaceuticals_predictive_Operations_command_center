const Loader = ({ fullScreen = false }) => {
  const spinner = (
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-100">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-10">{spinner}</div>
  );
};

export default Loader;
