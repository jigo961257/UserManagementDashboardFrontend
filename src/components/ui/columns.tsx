import { ColumnDef } from "@tanstack/react-table";
import { User } from "./AdminDashboard/ShowUserMnagement";
import { Button } from "@/components/ui/button"; // Assuming Button component is available here

interface ColumnProps {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleStatus: (user: User) => void; // NEW: Add onToggleStatus handler
}

export const getColumns = ({ onEdit, onDelete, onToggleStatus }: ColumnProps): ColumnDef<User>[] => [
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
 // src/components/columns.tsx માંથી
{
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => {
    const user = row.original;
    const status = user.status;
    const isActive = status?.toLowerCase() === "active";
    return (
      <Button
        // ... અન્ય પ્રોપ્સ ...
        onClick={() => onToggleStatus(user)} // આ ક્લિક હેન્ડલર છે
        className={`

          ${isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}
                    ${isActive ? "hover:bg-green-100 text-green-700" : "hover:bg-gray-200 text-gray-700"}


        `}
      >
        {status ?? "NA"}
      </Button>
    );
  },
},
  {
    header: "Action",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex gap-2">
          <Button
            onClick={() => onEdit(user)}
            variant="outline" // Use Button component for consistency
            size="sm" className="bg-green-800 text-white hover:bg-green-800 hover:text-white"
          >
            Edit
          </Button>
          <Button
            onClick={() => onDelete(user)}
            variant="destructive" // Use Button component for consistency
            size="sm"
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];
