import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { useUsers } from "../../hooks/useUsers";

const Users = () => {
  const { users, isLoading, isError } = useUsers();

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <EmptyState
        title="Unable to load users"
        description="Please refresh the page or try again later."
      />
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Users"
        subtitle="Manage system users and roles"
      />

      {users.length === 0 ? (
        <EmptyState
          title="No users found"
          description="User accounts will appear here once created."
        />
      ) : (
        <pre className="overflow-auto rounded-xl bg-white p-6 text-sm text-secondary-700">
          {JSON.stringify(users, null, 2)}
        </pre>
      )}
    </PageContainer>
  );
};

export default Users;
