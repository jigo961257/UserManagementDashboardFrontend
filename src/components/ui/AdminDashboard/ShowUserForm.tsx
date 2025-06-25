// import { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "recharts";
// import { toast } from 'react-toastify'; // Assuming you have react-toastify setup

// // Define the User interface (must match the one in ShowUserManagementPage)
// interface User {
//   id: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   roles?: {
//     name: string;
//   } | null;
// }

// interface EditUserModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   user: User | null; // The user object to edit
//   onSave: (updatedUser: User) => void; // Callback when save is clicked
// }

// export default function EditUserModal({ isOpen, onClose, user, onSave }: EditUserModalProps) {
//   const [formData, setFormData] = useState<User | null>(user);

//   // Update form data when the 'user' prop changes (e.g., when a new user is selected for editing)
//   useEffect(() => {
//     setFormData(user);
//   }, [user]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target;
//     if (formData) {
//       setFormData({
//         ...formData,
//         [id]: value,
//       });
//     }
//   };

//   const handleSave = () => {
//     if (formData) {
//       // In a real application, you would send this formData to your backend API
//       // For now, we'll just call the onSave callback with the updated data
//       toast.success("User updated locally!");
//       onSave(formData);
//       onClose(); // Close the modal after saving
//     }
//   };

//   if (!formData) {
//     return null; // Don't render if no user data is provided
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Edit User</DialogTitle>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label value="first_name" className="text-right">
//               First Name
//             </Label>
//             <Input
//               id="first_name"
//               value={formData.first_name}
//               onChange={handleChange}
//               className="col-span-3"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label value="last_name" className="text-right">
//               Last Name
//             </Label>
//             <Input
//               id="last_name"
//               value={formData.last_name}
//               onChange={handleChange}
//               className="col-span-3"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label value="email" className="text-right">
//               Email
//             </Label>
//             <Input
//               id="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="col-span-3"
//             />
//           </div>
//           {/* You might want to add a way to edit the role, if allowed */}
//           {/* <div className="grid grid-cols-4 items-center gap-4">
//             <Label value="role" className="text-right">
//               Role
//             </Label>
//             <Input
//               id="role"
//               value={formData.roles?.name || ''}
//               readOnly // Or provide a select input for roles
//               className="col-span-3"
//             />
//           </div> */}
//         </div>
//         <DialogFooter>
//           <Button variant="outline" onClick={onClose}>Cancel</Button>
//           <Button onClick={handleSave}>Save changes</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }