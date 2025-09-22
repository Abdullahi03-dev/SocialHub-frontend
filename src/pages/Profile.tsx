import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, MapPin, Calendar, Mail, Camera } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Types
interface User {
  name: string;
  role: string;
  email?: string;
  bio?: string;
  location?: string;
  created_at?: string;
  posts?: number;
  image?: string;
  id?: number;
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  user: User;
}

// Main Component
const Profile = () => {
  const navigate = useNavigate();

  // State
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", bio: "", location: "" });

  // File input reference (for avatar upload)
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auth Context
  const { userDetails, loading } = useAuth();

  // Fetch user + posts whenever userDetails changes
  useEffect(() => {
    const fetchPosts = async () => {
      if (!userDetails?.id) return; // only fetch if logged in
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/getallpostsForUser/${userDetails.id}`
        );
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchUser = async () => {
      if (!userDetails?.email) return;
      try {
        const res = await axios.post(
          "http://127.0.0.1:8000/auth/fetchbyemail/",
          { id: userDetails.id }
        );
        setUser(res.data);
        setFormData(res.data); // prefill form
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
    fetchPosts();
  }, [userDetails]);

  // Handle hidden file input trigger
  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file upload (avatar)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Basic validation
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please select a valid image (PNG, JPG, JPEG)");
      return;
    }
    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.put(
        `http://127.0.0.1:8000/edit/editImage/${userDetails?.email}/upload-image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Image uploaded successfully!");
      setTimeout(() => navigate(0), 200);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image!");
    }
  };

  // Handle form changes (edit profile dialog)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle profile update
  const handleSubmit = async (userId?: number) => {
    if (!userId) return;
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/edit/editUser/${userId}`,
        formData
      );
      toast.success(response.data.message);
      setTimeout(() => navigate(0), 100);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Error updating user");
    }
  };

  // --- Return UI ---
  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={true} />
      <div className="flex">
        <Sidebar />

        <main className="md:ml-24">
          <div className="container py-8">
            {/*  Loader */}
            {loading &&userDetails? (
              <p>Loading...</p>
            ) : (
              <>
                {/* Profile Header */}
                <Card className="mb-8">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Avatar + Upload */}
                      <div className="flex flex-col items-center md:items-start">
                        <div className="relative">
                          <Avatar className="h-32 w-32 mb-4">
                            <AvatarImage
                              src={
                                user?.image
                                  ? "http://127.0.0.1:8000/" + user.image
                                  : undefined
                              }
                              alt={user?.name}
                            />
                            {user?.name && (
                              <AvatarFallback className="gradient-primary font-bold">
                                <h3 className="text-4xl">
                                  {user.name.charAt(0).toUpperCase()}
                                  {user.name.charAt(1).toUpperCase()}
                                </h3>
                              </AvatarFallback>
                            )}
                          </Avatar>

                          {/* File Input it should be (hidden) */}
                          <Input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                          />

                          {/* Camera Icon Trigger */}
                          <Camera
                            size={40}
                            className="h-7 w-7 absolute bottom-0 right-0 cursor-pointer"
                            onClick={handleIconClick}
                          />
                        </div>

                        {/* Edit Profile Dialog */}
                        <Dialog
                          open={isEditDialogOpen}
                          onOpenChange={setIsEditDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" className="btn-secondary">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Profile
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Edit Profile</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Name</label>
                                <Input
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Bio</label>
                                <Textarea
                                  name="bio"
                                  value={formData.bio}
                                  onChange={handleChange}
                                  className="min-h-[100px] resize-none"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Location
                                </label>
                                <Input
                                  name="location"
                                  value={formData.location}
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  onClick={() => setIsEditDialogOpen(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => handleSubmit(user?.id)}
                                  className="btn-hero"
                                >
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {/* User Details */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h1 className="font-heading text-3xl font-bold">
                            {user?.name}
                          </h1>
                          <p className="text-muted-foreground text-lg">
                            @{user?.name}
                          </p>
                        </div>

                        <p className="text-foreground leading-relaxed">
                          {user?.bio}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {user?.location}
                          </div>
                          <div className="flex items-center">
                            <Badge
                              variant={
                                user?.role === "admin" ? "default" : "secondary"
                              }
                              className={
                                user?.role === "admin"
                                  ? "gradient-primary text-white"
                                  : ""
                              }
                            >
                              {user?.role}
                            </Badge>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            {user?.email}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {user?.created_at && (
                              <h3>Joined: {user.created_at.split("T")[0]}</h3>
                            )}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <h3 className="font-bold text-black">
                              Posts {user?.posts}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tabs Section */}
                <Tabs defaultValue="posts" className="space-y-6">
                  <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="posts">Posts</TabsTrigger>
                    <TabsTrigger value="liked">Liked</TabsTrigger>
                  </TabsList>

                  {/* Posts Tab */}
                  <TabsContent value="posts" className="space-y-6">
                    <h2 className="font-heading text-xl font-semibold">
                      Your Posts
                    </h2>

                    <div className="space-y-6">
                      {/* {} */}
                      {posts.map((post: any) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          email={`${userDetails?.email}`}
                          onLike={(id) => console.log("Like", id)}
                          onComment={(id, c) => console.log("Comment", id, c)}
                        />
                      ))}
                    </div>
                  </TabsContent>

                  {/* Liked Tab */}
                  <TabsContent value="liked" className="space-y-6">
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        Posts you&apos;ve liked will appear here.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
