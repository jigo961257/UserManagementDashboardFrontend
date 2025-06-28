"use client"

// import { ColumnDef } from "@tanstack/react-table";
// import { ColumnDef } from "@tanstack/react-table";
import type { User } from "./AdminDashboard/ShowUserMnagement"; // Make sure this path is correct
 // Make sure this path is correct
import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox"; // Assuming Checkbox is at this path
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Eye, Trash, Archive } from "lucide-react"; // Import Archive icon
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ColumnProps {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleStatus: (user: User) => void; // This will now be triggered by the new Archive button
  onView: (user: User) => void; 
}

export const getColumns = ({ onEdit, onDelete, onToggleStatus, onView }: ColumnProps): ColumnDef<User>[] => [
 
  {
    accessorKey: "first_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "last_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
 
  {
        accessorKey: "actions",

    header: () => {
      return (
        <Button
          variant="ghost"
        >
          Actions
        </Button>
      )
    },
    cell: ({ row }) => {
      const user = row.original;
      const isUserActive = user.status?.toLowerCase() === "active";

      return (
        <div className="flex gap-2">
         <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => onView(user)}
                  variant="outline"
                  size="sm"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Eye className="h-4 w-4 mr-1" /> 
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
          <Button
            onClick={() => onEdit(user)}
            variant="outline"
            size="sm"
            className="bg-green-800 text-white hover:bg-green-800 hover:text-white"
          >
            <Edit className="h-4 w-4 mr-1" /> 
          </Button>
          </TooltipTrigger>
              <TooltipContent>
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* NEW: Archive/Unarchive Button */}
           <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
          <Button
            onClick={() => onToggleStatus(user)} // Call onToggleStatus from here
            variant="outline"
            size="sm"
            className={isUserActive 
                ? "bg-red-100 text-red-700 hover:bg-red-200" // Red for Archive (when active)
                : "bg-blue-100 hover:text-red-700 hover:bg-blue-200" // Blue for Unarchive (when inactive)
            }
            title={isUserActive ? "Archive User" : "Unarchive User"}
          >
            <Archive className="h-4 w-4 mr-1" />
          </Button>
          </TooltipTrigger>
              <TooltipContent>
                <p>Archive</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

               <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
           <Button
            onClick={() => onDelete(user)}
            variant="destructive"
            size="sm"
          >
            <Trash className="h-4 w-4 mr-1" /> 
          </Button>
          </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
         
         
        </div>
      );
    },
  },
];
