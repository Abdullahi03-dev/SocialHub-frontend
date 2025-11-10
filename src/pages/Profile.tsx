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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, MapPin, Calendar, Mail, Camera, Loader2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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

const Profile = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", bio: "", location: "" });
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const savedEmail = localStorage.getItem("token");

  // Fetch user profile + posts
  useEffect(() => {
    if (!savedEmail) {
      alert("Error: no email found in localStorage");
      return;
    }

    const fetchUserAndPosts = async () => {
      try {
        const userRes = await axios.get(`${API_URL}/auth/fetchbyemail`, {
          headers: { Authorization:`Bearer ${savedEmail}` },
          withCredentials: true,
        });
        setUser(userRes.data);
        setFormData({
          name: userRes.data.name || "",
          bio: userRes.data.bio || "",
          location: userRes.data.location || "",
        });

        const postsRes = await axios.get(
          `${API_URL}/getallpostsForUser`,
          {headers:{
            Authorization:`Bearer ${savedEmail}`

          } ,withCredentials: true }
        );
        setPosts(postsRes.data);
      } catch (err) {
        console.error("Error fetching profile or posts:", err);
        toast.error("Failed to fetch profile or posts");
      } finally {
        setDataLoaded(true);
      }
    };

    fetchUserAndPosts();
  }, [savedEmail]);

  // Upload avatar
  const handleIconClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please select a valid image (PNG, JPG, JPEG)");
      return;
    }
    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    const uploadForm = new FormData();
    uploadForm.append("file", selectedFile);

    try {
      await axios.put(
        `${API_URL}/edit/editImage/upload-image`,
        uploadForm,
        {
          headers: {Authorization:`Bearer ${savedEmail}` ,"Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Image uploaded successfully");
      setTimeout(() => navigate(0), 200);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    }
  };

  // Form handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (userId?: number) => {
    if (!userId) return;

    if (!formData.name || !formData.bio || !formData.location) {
      toast.error("All fields must be filled before saving");
      return;
    }

    setIsSaving(true);

    try {
      const payload: Record<string, string> = {
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
      };

      const response = await axios.put(
        `${API_URL}/edit/editUser/${userId}`,
        payload,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setTimeout(() => navigate(0), 100);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Error updating user");
    } finally {
      setIsSaving(false);
    }
  };

  if (!dataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xl font-semibold">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={true} />

      <div className="flex">
        {/* Sidebar */}
        <aside
          className="fixed top-20 left-0 h-screen bg-white border-r shadow-sm
                     w-16 sm:w-20 md:w-24 lg:w-64 flex flex-col"
        >
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 ml-16 sm:ml-20 md:ml-24 lg:ml-64">
          <div className="container py-6 px-4 sm:px-6 lg:px-8 max-w-6xl">
            {/* Profile Card */}
            <Card className="mb-8 max-w-3xl">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:gap-8">
                  {/* Avatar */}
                  <div className="flex flex-col items-center sm:items-start">
                    <div className="relative">
                      <Avatar className="h-28 w-28 sm:h-32 sm:w-32 mb-4">
                        <AvatarImage
                          src={user?.image ? `${API_URL}/${user.image}` : undefined}
                          alt={user?.name}
                        />
                        {user?.name && (
                          <AvatarFallback className="gradient-primary font-bold text-3xl sm:text-4xl">
                            {user.name.charAt(0).toUpperCase()}
                            {user.name.charAt(1).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>

                      <Input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                      />

                      <Camera
                        size={28}
                        className="h-6 w-6 sm:h-7 sm:w-7 absolute bottom-0 right-0 cursor-pointer"
                        onClick={handleIconClick}
                      />
                    </div>

                    {/* Edit Button */}
                    <Dialog
                      open={isEditDialogOpen}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="mt-4 w-full sm:w-auto"
                        >
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
                              placeholder={user?.name}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Bio</label>
                            <Textarea
                              name="bio"
                              value={formData.bio}
                              onChange={handleChange}
                              className="min-h-[100px] resize-none"
                              placeholder={user?.bio}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Location</label>
                            <Input
                              name="location"
                              value={formData.location}
                              onChange={handleChange}
                              placeholder={user?.location}
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
                              className="btn-hero flex items-center"
                              disabled={isSaving}
                            >
                              {isSaving && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 space-y-4 text-center sm:text-left mt-6 sm:mt-0">
                    <div>
                      <h1 className="font-heading text-2xl sm:text-3xl font-bold">
                        {user?.name}
                      </h1>
                      <p className="text-muted-foreground text-base sm:text-lg">
                        @{user?.name}
                      </p>
                    </div>
                    <p className="text-foreground text-sm sm:text-base leading-relaxed">
                      {user?.bio}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 text-sm text-muted-foreground justify-center sm:justify-start">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {user?.location}
                      </div>
                      <div className="flex items-center">
                        <Badge
                          variant={user?.role === "admin" ? "default" : "secondary"}
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

            {/* Tabs */}
            <Tabs defaultValue="posts" className="space-y-6">
              <TabsList className="grid w-full max-w-sm grid-cols-2 mx-auto sm:mx-0">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="liked">Liked</TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="space-y-6">
                <h2 className="font-heading text-lg sm:text-xl font-semibold">
                  Your Posts
                </h2>
                <div className="space-y-6">
                  {posts.map((post: any) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      // email={savedEmail || ""}
                      // onLike={(id) => console.log("Like", id)}
                      // onComment={(id, c) => console.log("Comment", id, c)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="liked" className="space-y-6">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Posts you've liked will appear here.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
