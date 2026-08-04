import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { useTasks } from "../../hooks/useTasks";

const Tasks = () => {
  const { tasks, isLoading, isError } = useTasks();

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <EmptyState
        title="Unable to load tasks"
        description="Please refresh the page or try again later."
      />
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Tasks"
        subtitle="Assign and track operational tasks"
      />

      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description="Tasks will appear here once created."
        />
      ) : (
        <pre className="overflow-auto rounded-xl bg-white p-6 text-sm text-secondary-700">
          {JSON.stringify(tasks, null, 2)}
        </pre>
      )}
    </PageContainer>
  );
};

export default Tasks;
