import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import UserCard from "@/components/UserCard";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {  Users as UsersIcon } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";


interface Users {
  id: string;
  name: string;
  email:string;
  role:string;
  created_at: string;
  posts: number;
  isAdmin:boolean;
}


// Mock data
// const mockUsers = [
//   {
//     id: "1",
//     name: "Sarah Johnson",
//     email: "sarah.johnson@example.com",
//     avatar: "https://images.unsplash.com/photo-1494790108755-2616b2e7cc5a?w=100&h=100&fit=crop&crop=face",
//     role: "admin",
//     joinDate: "Jan 2024",
//     location: "San Francisco, CA",
//     postsCount: 45,
//     followersCount: 1234,
//     followingCount: 567
//   },
//   {
//     id: "2",
//     name: "Mike Chen",
//     email: "mike.chen@example.com",
//     avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
//     role: "user",
//     joinDate: "Feb 2024",
//     location: "New York, NY",
//     postsCount: 23,
//     followersCount: 456,
//     followingCount: 234
//   }
// ];

const Users = () => {
  const [users, setUsers] = useState<Users[]>([]);
  const [isMobile,setIsMobile]=useState(window.innerWidth<=768)
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isAdmin,setIsAdmin]=useState(false)


  const { userDetails } = useAuth();

  // Fetch user + posts whenever userDetails changes
  useEffect(() => {
    const fetchIsAdmin = async () => {
      if (!userDetails?.id) return; // only fetch if logged in
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/checkAdmin/${userDetails.id}`
        );
        setIsAdmin(res.data.is_admin)
        // setPosts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchIsAdmin();
  }, [userDetails]);


  const loadUsers = async () => {
    try {
      const res = await axios.get<Users[]>("http://127.0.0.1:8000/users", {
});
      setUsers(res.data);
      console.log(res.data)
    } catch (error) {
      console.error(error);
      toast.error("Failed to load Users");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);



  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };


  useEffect(()=>{
    const handleResize=()=>setIsMobile(window.innerWidth<=768)
    window.addEventListener('resize',handleResize)
    return ()=>window.removeEventListener('resize',handleResize)
  },[])



  useEffect(()=>{
    if(!isMobile){
      setViewMode('table')
    }
    else{
      setViewMode("grid")
    }
  },[isMobile])

  const userStats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  return (
    <div className="min-h-screen bg-background ">
      <Header isAuthenticated={true} />
      
      <div className="flex">
        <Sidebar />
        
        <main className="md:ml-34 ml-20">
          <div className="container py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
              <div>
                <h1 className="font-heading text-3xl font-bold">Users</h1>
                <p className="text-muted-foreground mt-1">
                  Manage and view all platform users
                </p>
              </div>
              
              <div className="flex items-center gap-2">
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
            {viewMode === "grid"?(
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onDelete={handleDeleteUser}
                    isAdmin={isAdmin}
                    showDeleteButton={user.role !== 'admin'}
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
                          {isAdmin&&(
                          <th className="py-4 px-6 text-left font-medium">Actions</th>

                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <UserCard
                            key={user.id}
                            user={user}
                            onDelete={handleDeleteUser}
                            showDeleteButton={user.role !== 'admin'}
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