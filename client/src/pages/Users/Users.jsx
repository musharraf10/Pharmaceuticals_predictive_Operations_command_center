import { useState } from "react";
import { useForm } from "react-hook-form";
import { MoreHorizontal, Plus, ShieldCheck, UserRoundCheck, Users as UsersIcon } from "lucide-react";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import DataTable, { TableCell, TableRow } from "../../components/ui/DataTable";
import Dropdown, { DropdownDivider, DropdownItem } from "../../components/ui/Dropdown";
import EmptyState from "../../components/ui/EmptyState";
import Input from "../../components/ui/Input";
import KPICard from "../../components/ui/KPICard";
import Loader from "../../components/ui/Loader";
import Modal from "../../components/ui/Modal";
import Select from "../../components/ui/Select";
import { useUsers } from "../../hooks/useUsers";
import { formatDate } from "../../utils/formatDate";

const columns = [
  { header: "User", key: "name", sortable: true, sortKey: "name" },
  { header: "Email", key: "email", sortable: true, sortKey: "email" },
  { header: "Role", key: "role", sortable: true, sortKey: "role" },
  { header: "Department", key: "department", sortable: true, sortKey: "department" },
  { header: "Last Login", key: "lastLogin", sortable: true, sortKey: "lastLogin" },
  { header: "Status", key: "isActive", sortable: true, sortKey: "isActive" },
  { header: "", key: "actions" },
];

const roleOptions = ["ADMIN", "MANAGER", "ANALYST", "OPERATOR"].map((role) => ({
  label: role.charAt(0) + role.slice(1).toLowerCase(),
  value: role,
}));

const roleColor = {
  ADMIN: "danger",
  MANAGER: "primary",
  ANALYST: "info",
  OPERATOR: "success",
};

const Users = () => {
  const {
    users,
    isLoading,
    isError,
    createUserAsync,
    updateUserAsync,
    deleteUserAsync,
    isCreating,
    isUpdating,
  } = useUsers();
  const [modal, setModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const userForm = useForm({
    defaultValues: { name: "", email: "", password: "", role: "OPERATOR", department: "Operations" },
  });
  const editForm = useForm({
    defaultValues: { name: "", role: "OPERATOR", department: "Operations" },
  });

  if (isLoading) return <Loader fullScreen />;

  if (isError) {
    return (
      <EmptyState
        title="Unable to load users"
        description="Please refresh the page or try again later."
      />
    );
  }

  const managers = users.filter((user) => user.role === "MANAGER").length;
  const analysts = users.filter((user) => user.role === "ANALYST").length;
  const activeUsers = users.filter((user) => user.isActive !== false).length;

  const closeModal = () => {
    setModal(null);
    setSelectedUser(null);
    userForm.reset();
    editForm.reset();
  };

  const openEdit = (user) => {
    setSelectedUser(user);
    editForm.reset({
      name: user.name ?? "",
      role: user.role ?? "OPERATOR",
      department: user.department ?? "Operations",
    });
    setModal("edit");
  };

  const createUser = async (values) => {
    await createUserAsync(values);
    closeModal();
  };

  const updateUser = async (values) => {
    await updateUserAsync({ id: selectedUser._id, payload: values });
    closeModal();
  };

  return (
    <PageContainer>
      <PageHeader
        title="Users"
        subtitle="Role based access, departments, and operational ownership"
        action={<Button icon={Plus} onClick={() => setModal("create")}>Create User</Button>}
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard title="Total Users" value={users.length} icon={UsersIcon} color="primary" />
        <KPICard title="Active Users" value={activeUsers} icon={UserRoundCheck} color="success" />
        <KPICard title="Managers" value={managers} icon={ShieldCheck} color="info" />
        <KPICard title="Analysts" value={analysts} color="warning" />
      </div>

      <DataTable
        data={users}
        columns={columns}
        searchKeys={["name", "email", "role", "department"]}
        searchPlaceholder="Search users..."
        emptyTitle="No users found"
        emptyDescription="Create users to assign operational ownership and access."
        renderRow={(user) => (
          <TableRow key={user._id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                  {user.name
                    ?.split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() ?? "U"}
                </div>
                <span className="font-medium text-secondary-900">{user.name}</span>
              </div>
            </TableCell>
            <TableCell className="text-secondary-500">{user.email}</TableCell>
            <TableCell>
              <Badge color={roleColor[user.role] ?? "secondary"}>{user.role}</Badge>
            </TableCell>
            <TableCell>{user.department ?? "Operations"}</TableCell>
            <TableCell className="text-secondary-500">{formatDate(user.lastLogin)}</TableCell>
            <TableCell>
              <Badge color={user.isActive === false ? "secondary" : "success"} dot>
                {user.isActive === false ? "Inactive" : "Active"}
              </Badge>
            </TableCell>
            <TableCell>
              <Dropdown
                trigger={
                  <button className="rounded-lg p-1.5 text-secondary-400 hover:bg-secondary-100 hover:text-secondary-600">
                    <MoreHorizontal size={18} />
                  </button>
                }
              >
                <DropdownItem onClick={() => openEdit(user)}>Edit User</DropdownItem>
                <DropdownDivider />
                <DropdownItem danger onClick={() => deleteUserAsync(user._id)}>
                  Delete User
                </DropdownItem>
              </Dropdown>
            </TableCell>
          </TableRow>
        )}
      />

      <Modal
        open={modal === "create"}
        title="Create User"
        onClose={closeModal}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit" form="user-form" loading={isCreating}>Create User</Button>
          </>
        }
      >
        <form id="user-form" onSubmit={userForm.handleSubmit(createUser)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Full Name"
              error={userForm.formState.errors.name?.message}
              {...userForm.register("name", { required: "Name is required" })}
            />
            <Input
              label="Email"
              type="email"
              error={userForm.formState.errors.email?.message}
              {...userForm.register("email", { required: "Email is required" })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Password"
              type="password"
              error={userForm.formState.errors.password?.message}
              {...userForm.register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Use at least 6 characters" },
              })}
            />
            <Select label="Role" options={roleOptions} {...userForm.register("role")} />
          </div>
          <Input label="Department" {...userForm.register("department")} />
        </form>
      </Modal>

      <Modal
        open={modal === "edit"}
        title={`Edit ${selectedUser?.name ?? "User"}`}
        onClose={closeModal}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit" form="edit-user-form" loading={isUpdating}>Save Changes</Button>
          </>
        }
      >
        <form id="edit-user-form" onSubmit={editForm.handleSubmit(updateUser)} className="space-y-4">
          <Input
            label="Full Name"
            error={editForm.formState.errors.name?.message}
            {...editForm.register("name", { required: "Name is required" })}
          />
          <Select label="Role" options={roleOptions} {...editForm.register("role")} />
          <Input label="Department" {...editForm.register("department")} />
        </form>
      </Modal>
    </PageContainer>
  );
};

export default Users;
