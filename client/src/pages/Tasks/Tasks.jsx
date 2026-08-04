import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { CalendarClock, CheckCircle2, ClipboardList, MoreHorizontal, Plus, UserPlus } from "lucide-react";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import DataTable, { TableCell, TableRow } from "../../components/ui/DataTable";
import Dropdown, { DropdownDivider, DropdownItem } from "../../components/ui/Dropdown";
import EmptyState from "../../components/ui/EmptyState";
import Input from "../../components/ui/Input";
import KPICard from "../../components/ui/KPICard";
import Loader from "../../components/ui/Loader";
import Modal from "../../components/ui/Modal";
import Select from "../../components/ui/Select";
import StatusBadge from "../../components/ui/StatusBadge";
import { useTasks } from "../../hooks/useTasks";
import { useUsers } from "../../hooks/useUsers";
import { formatDate } from "../../utils/formatDate";
import { TASK_PRIORITY, TASK_STATUS } from "../../utils/statusConfig";

const columns = [
  { header: "Task", key: "title", sortable: true, sortKey: "title" },
  { header: "Owner", key: "assignedTo", sortable: true, sortKey: "assignedTo.name" },
  { header: "Priority", key: "priority", sortable: true, sortKey: "priority" },
  { header: "Due Date", key: "dueDate", sortable: true, sortKey: "dueDate" },
  { header: "Status", key: "status", sortable: true, sortKey: "status" },
  { header: "", key: "actions" },
];

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((value) => ({
  label: TASK_PRIORITY[value].label,
  value,
}));

const statusOptions = ["PENDING", "IN_PROGRESS", "COMPLETED", "ESCALATED"].map((value) => ({
  label: TASK_STATUS[value].label,
  value,
}));

const Tasks = () => {
  const {
    tasks,
    isLoading,
    isError,
    createTaskAsync,
    assignTaskAsync,
    updateTaskStatusAsync,
    deleteTaskAsync,
    isCreating,
    isAssigning,
    isUpdatingStatus,
  } = useTasks();
  const { users } = useUsers();
  const [modal, setModal] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const userOptions = useMemo(
    () => users.map((user) => ({ label: `${user.name} - ${user.role}`, value: user._id })),
    [users],
  );

  const taskForm = useForm({
    defaultValues: { title: "", description: "", priority: "MEDIUM", assignedTo: "", dueDate: "" },
  });
  const assignForm = useForm({ defaultValues: { assignedTo: "" } });
  const statusForm = useForm({ defaultValues: { status: "PENDING" } });

  if (isLoading) return <Loader fullScreen />;

  if (isError) {
    return (
      <EmptyState
        title="Unable to load tasks"
        description="Please refresh the page or try again later."
      />
    );
  }

  const pending = tasks.filter((task) => task.status !== "COMPLETED").length;
  const completed = tasks.filter((task) => task.status === "COMPLETED").length;
  const critical = tasks.filter((task) => task.priority === "CRITICAL").length;

  const openAssign = (task) => {
    setSelectedTask(task);
    assignForm.reset({ assignedTo: task.assignedTo?._id ?? "" });
    setModal("assign");
  };

  const openStatus = (task) => {
    setSelectedTask(task);
    statusForm.reset({ status: task.status ?? "PENDING" });
    setModal("status");
  };

  const closeModal = () => {
    setModal(null);
    setSelectedTask(null);
    taskForm.reset();
  };

  const createTask = async (values) => {
    const payload = {
      ...values,
      assignedTo: values.assignedTo || undefined,
      dueDate: values.dueDate || undefined,
    };
    await createTaskAsync(payload);
    closeModal();
  };

  const assignTask = async (values) => {
    await assignTaskAsync({ id: selectedTask._id, payload: values });
    closeModal();
  };

  const updateStatus = async (values) => {
    await updateTaskStatusAsync({ id: selectedTask._id, payload: values });
    closeModal();
  };

  return (
    <PageContainer>
      <PageHeader
        title="Tasks"
        subtitle="Assign, prioritize, and close operational work across the supply chain"
        action={<Button icon={Plus} onClick={() => setModal("create")}>New Task</Button>}
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard title="Total Tasks" value={tasks.length} icon={ClipboardList} color="primary" />
        <KPICard title="Open Work" value={pending} icon={CalendarClock} color="warning" />
        <KPICard title="Completed" value={completed} icon={CheckCircle2} color="success" />
        <KPICard title="Critical" value={critical} color="danger" />
      </div>

      <DataTable
        data={tasks}
        columns={columns}
        searchKeys={["title", "description", "assignedTo.name", "priority", "status"]}
        searchPlaceholder="Search tasks..."
        emptyTitle="No tasks found"
        emptyDescription="Create a task to coordinate production, quality, and fulfillment work."
        renderRow={(task) => (
          <TableRow key={task._id}>
            <TableCell>
              <div>
                <p className="font-medium text-secondary-900">{task.title}</p>
                {task.description && (
                  <p className="mt-1 max-w-md truncate text-[13px] text-secondary-500">
                    {task.description}
                  </p>
                )}
              </div>
            </TableCell>
            <TableCell className="text-secondary-500">
              {task.assignedTo?.name ?? "Unassigned"}
            </TableCell>
            <TableCell>
              <StatusBadge statusMap={TASK_PRIORITY} status={task.priority} />
            </TableCell>
            <TableCell className="text-secondary-500">{formatDate(task.dueDate)}</TableCell>
            <TableCell>
              <StatusBadge statusMap={TASK_STATUS} status={task.status} />
            </TableCell>
            <TableCell>
              <Dropdown
                trigger={
                  <button className="rounded-lg p-1.5 text-secondary-400 hover:bg-secondary-100 hover:text-secondary-600">
                    <MoreHorizontal size={18} />
                  </button>
                }
              >
                <DropdownItem icon={UserPlus} onClick={() => openAssign(task)}>
                  Assign Owner
                </DropdownItem>
                <DropdownItem onClick={() => openStatus(task)}>Update Status</DropdownItem>
                <DropdownDivider />
                <DropdownItem danger onClick={() => deleteTaskAsync(task._id)}>
                  Delete Task
                </DropdownItem>
              </Dropdown>
            </TableCell>
          </TableRow>
        )}
      />

      <Modal
        open={modal === "create"}
        title="Create Task"
        onClose={closeModal}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit" form="task-form" loading={isCreating}>Create Task</Button>
          </>
        }
      >
        <form id="task-form" onSubmit={taskForm.handleSubmit(createTask)} className="space-y-4">
          <Input
            label="Task Title"
            error={taskForm.formState.errors.title?.message}
            {...taskForm.register("title", { required: "Task title is required" })}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700">Description</label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-secondary-300 px-4 py-2.5 text-[15px] focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              {...taskForm.register("description")}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Priority" options={priorityOptions} {...taskForm.register("priority")} />
            <Input label="Due Date" type="date" {...taskForm.register("dueDate")} />
          </div>
          <Select label="Assign To" placeholder="Choose owner" options={userOptions} {...taskForm.register("assignedTo")} />
        </form>
      </Modal>

      <Modal
        open={modal === "assign"}
        title={`Assign ${selectedTask?.title ?? "Task"}`}
        onClose={closeModal}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit" form="assign-form" loading={isAssigning}>Assign</Button>
          </>
        }
      >
        <form id="assign-form" onSubmit={assignForm.handleSubmit(assignTask)}>
          <Select
            label="Owner"
            placeholder="Choose owner"
            options={userOptions}
            error={assignForm.formState.errors.assignedTo?.message}
            {...assignForm.register("assignedTo", { required: "Owner is required" })}
          />
        </form>
      </Modal>

      <Modal
        open={modal === "status"}
        title={`Update ${selectedTask?.title ?? "Task"}`}
        onClose={closeModal}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit" form="status-form" loading={isUpdatingStatus}>Update</Button>
          </>
        }
      >
        <form id="status-form" onSubmit={statusForm.handleSubmit(updateStatus)}>
          <Select label="Status" options={statusOptions} {...statusForm.register("status")} />
        </form>
      </Modal>
    </PageContainer>
  );
};

export default Tasks;
