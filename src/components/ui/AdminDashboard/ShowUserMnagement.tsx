import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
 roles?: {
    name: string;
  } | null;
}

const TABS = [  "SuperAdmin",  "Admin","Teacher", "Student","Parent"];

export default function ShowUserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("SuperAdmin");

 const fetchUsers = async (roleName: string) => {
  setLoading(true);
  const token=sessionStorage.getItem("accessToken")
  try {
     const response = await axios.post<User>(
        `http://localhost:8001/user/getall`,
        { "roleName": roleName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response);
    const userArray = response?.data?.data; // update this line as needed
    if (Array.isArray(userArray)) {
      setUsers(userArray);
    } else {
      console.error("Expected array but got:", userArray);
      setUsers([]);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    setUsers([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchUsers(activeTab);
  }, [activeTab]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <TabsTrigger key={tab} value={tab} className="capitalize">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Content (one shared table) */}
        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="p-4">
              {loading ? (
                <p>Loading users...</p>
              ) : users.length === 0 ? (
                <p>No users found for <strong>{activeTab}</strong>.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>First Name</TableHead>
                      <TableHead>Last Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      {/* <TableHead>Actions</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.first_name}</TableCell>
                        <TableCell>{user.last_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.roles?.name?? "NA"}</TableCell>
                        {/* <TableCell>
                          <Button variant="outline" className="mr-2">
                            Edit
                          </Button>
                          <Button variant="destructive">Delete</Button>
                        </TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
