import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import PostCard from "@/components/PostCard";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {  MapPin, Calendar, Mail } from "lucide-react";
import axios from "axios";
// import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
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
  const {id}=useParams()
  const navigate = useNavigate();

  // State
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  // const [formData, setFormData] = useState({ name: "", bio: "", location: "" });
  
  // File input reference (for avatar upload)
  // const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auth Context
  const { userDetails, loading } = useAuth();

  // Fetch user + posts whenever userDetails changes
  useEffect(() => {
    const fetchPosts = async () => {
      if(!id) return navigate('/users')
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/getallpostsForUser/${id}`
        );
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchUser = async () => {
      if(!id) return navigate('/users')
      try {
        const res = await axios.post(
          "http://127.0.0.1:8000/auth/fetchbyemail/",
          { id: id }
        );
        setUser(res.data);
        // setFormData(res.data); // prefill form
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
    fetchPosts();
  }, [userDetails]);

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
                          
                        </div>

                       
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
