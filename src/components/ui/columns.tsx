import { ColumnDef } from "@tanstack/react-table";
// Make sure this path is correct for your User interface
import { User } from "./AdminDashboard/ShowUserMnagement"; 

interface ColumnProps {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void; // NEW: Add onDelete handler
}

export const getColumns = ({ onEdit, onDelete }: ColumnProps): ColumnDef<User>[] => [
  {
    accessorKey: "first_name",
    header: "First Name",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const isActive = status?.toLowerCase() === "active";
      return (
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium ${
            isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
          }`}
        >
          {status ?? "NA"}
        </span>
      );
    },
  },
  {
    header: "Action",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(user)}
            className="text-blue-600 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(user)} // NEW: Call onDelete handler
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      );
    },
  },
];
