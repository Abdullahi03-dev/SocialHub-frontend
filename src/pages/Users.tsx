import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import UserCard from "@/components/UserCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users as UsersIcon } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
// import { useAuth } from "@/context/AuthContext";

interface Users {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  posts: number;
  isAdmin: boolean;
}

const Users = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [users, setUsers] = useState<Users[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isAdmin, setIsAdmin] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const savedEmail = localStorage.getItem("email");

  // const { userDetails } = useAuth();

  // Check if current user is admin
  useEffect(() => {
    const fetchIsAdmin = async () => {
      if (!savedEmail) return;
      try {
        const res = await axios.get(`${API_URL}/checkAdmin/${savedEmail}`);
        setIsAdmin(res.data.is_admin);
      } catch (err) {
        console.error(err);
      }
    };
    fetchIsAdmin();
  }, [savedEmail]);

  // Fetch all users
  const loadUsers = async () => {
    try {
      const res = await axios.get<Users[]>(`${API_URL}/users`);
      setUsers(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setDataLoaded(true);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Delete user locally
  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  // Handle responsive view mode
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setViewMode(isMobile ? "grid" : "table");
  }, [isMobile]);

  const userStats = {
    total: users.length,
    admins: users.filter(u => u.role === "admin").length,
  };

  if (!dataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xl font-semibold">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={true} />
      <div className="flex">
        <Sidebar />
        <main className="md:ml-34 ml-20">
          <div className="container py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
              <div>
                <h1 className="font-heading text-3xl font-bold">Users</h1>
                <p className="text-muted-foreground mt-1">Manage and view all platform users</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="py-4 px-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold">{userStats.total}</p>
                    </div>
                    <UsersIcon className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-4 px-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Admins</p>
                      <p className="text-2xl font-bold">{userStats.admins}</p>
                    </div>
                    <Badge className="gradient-primary text-white">Admin</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Users Display */}
            {viewMode === "grid" ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(user => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onDelete={handleDeleteUser}
                    isAdmin={isAdmin}
                    showDeleteButton={user.role !== "admin"}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Users Table</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="py-4 px-6 text-left font-medium">User</th>
                          <th className="py-4 px-6 text-left font-medium">Role</th>
                          <th className="py-4 px-6 text-left font-medium">Joined</th>
                          <th className="py-4 px-6 text-left font-medium">Posts</th>
                          {isAdmin && <th className="py-4 px-6 text-left font-medium">Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <UserCard
                            key={user.id}
                            user={user}
                            onDelete={handleDeleteUser}
                            showDeleteButton={user.role !== "admin"}
                            isAdmin={isAdmin}
                            variant="table"
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Users;
