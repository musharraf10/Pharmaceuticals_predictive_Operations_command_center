import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { CalendarClock, CheckCircle2, ClipboardList, Edit3, Plus, Trash2 } from "lucide-react";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import DataTable, { TableCell, TableRow } from "../../components/ui/DataTable";
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
  { header: "Actions", key: "actions", className: "text-right" },
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
    updateTaskAsync,
    deleteTaskAsync,
    isCreating,
    isUpdating,
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
  const editForm = useForm({
    defaultValues: { title: "", description: "", priority: "MEDIUM", assignedTo: "", dueDate: "", status: "PENDING" },
  });

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

  const openEdit = (task) => {
    setSelectedTask(task);
    editForm.reset({
      title: task.title ?? "",
      description: task.description ?? "",
      assignedTo: task.assignedTo?._id ?? task.assignedTo ?? "",
      priority: task.priority ?? "MEDIUM",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      status: task.status ?? "PENDING",
    });
    setModal("edit");
  };

  const closeModal = () => {
    setModal(null);
    setSelectedTask(null);
    taskForm.reset();
    editForm.reset();
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

  const saveEditTask = async (values) => {
    const payload = {
      ...values,
      assignedTo: values.assignedTo || undefined,
      dueDate: values.dueDate || undefined,
    };
    await updateTaskAsync({ id: selectedTask._id, payload });
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
                <p className="font-semibold text-secondary-900 dark:text-white">{task.title}</p>
                {task.description && (
                  <p className="mt-1 max-w-md truncate text-[13px] text-secondary-500 dark:text-slate-300">
                    {task.description}
                  </p>
                )}
              </div>
            </TableCell>
            <TableCell className="text-secondary-600 dark:text-slate-200 font-medium">
              {task.assignedTo?.name ?? "Unassigned"}
            </TableCell>
            <TableCell>
              <StatusBadge statusMap={TASK_PRIORITY} status={task.priority} />
            </TableCell>
            <TableCell className="text-secondary-500 dark:text-slate-300">{formatDate(task.dueDate)}</TableCell>
            <TableCell>
              <StatusBadge statusMap={TASK_STATUS} status={task.status} />
            </TableCell>
            <TableCell className="text-right whitespace-nowrap">
              <div className="inline-flex items-center justify-end gap-1.5">
                <Button size="sm" variant="outline" icon={Edit3} onClick={() => openEdit(task)}>Edit</Button>
                <Button size="sm" variant="ghost" icon={Trash2} onClick={() => deleteTaskAsync(task._id)}>Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      />

      <Modal
        open={modal === "create"}
        title="Create Task"
        onClose={closeModal}
        size="lg"
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
            <label className="text-sm font-medium text-secondary-700 dark:text-slate-300">Description</label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-secondary-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-[15px] text-secondary-900 dark:text-white placeholder-secondary-400 dark:placeholder-slate-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              {...taskForm.register("description")}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Priority Level" options={priorityOptions} {...taskForm.register("priority")} />
            <Input label="Due Date" type="date" {...taskForm.register("dueDate")} />
          </div>
          <Select label="Assign User" placeholder="Choose owner" options={userOptions} {...taskForm.register("assignedTo")} />
        </form>
      </Modal>

      <Modal
        open={modal === "edit"}
        title="Edit Task Details"
        onClose={closeModal}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit" form="edit-task-form" loading={isUpdating}>Save Changes</Button>
          </>
        }
      >
        <form id="edit-task-form" onSubmit={editForm.handleSubmit(saveEditTask)} className="space-y-4">
          <Input
            label="Task Title"
            error={editForm.formState.errors.title?.message}
            {...editForm.register("title", { required: "Title is required" })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Assign User"
              placeholder="Choose user"
              options={userOptions}
              {...editForm.register("assignedTo")}
            />
            <Select label="Status" options={statusOptions} {...editForm.register("status")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Priority" options={priorityOptions} {...editForm.register("priority")} />
            <Input label="Due Date" type="date" {...editForm.register("dueDate")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700 dark:text-slate-300">Description</label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-secondary-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-[15px] text-secondary-900 dark:text-white placeholder-secondary-400 dark:placeholder-slate-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              {...editForm.register("description")}
            />
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
};

export default Tasks;
