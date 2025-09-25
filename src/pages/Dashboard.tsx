import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, TrendingUp } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Label } from "@radix-ui/react-label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface FormDataType {
  content: string;
  tags: string;
  image: File | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newPost, setNewPost] = useState<FormDataType>({ content: "", tags: "", image: null });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [hashTagsAnalytics, setHashTagsAnalytics] = useState<string[]>([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // const savedEmail = localStorage.getItem("email");
  const { userDetails } = useAuth();

  // Fetch hashtags
  const fetchHashTags = async () => {
    try {
      const res = await axios.get(`${API_URL}/top-hashtags/`);
      const flattags = res.data
        .map((tag: any) => tag.split(","))
        .flat()
        .map((tag: any) => tag.trim());
      setHashTagsAnalytics(flattags);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch top users
  const fetchTopUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/top-users/`);
      setActiveUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_URL}/getallposts/`);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchHashTags(), fetchTopUsers(), fetchPosts()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Handle text input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewPost({ ...newPost, image: e.target.files[0] });
    } else {
      setNewPost({ ...newPost, image: null });
    }
  };

  // Handle post submission
  const handleSubmit = async () => {
    if (!userDetails?.email) return toast.error("Account Not Found, Sign in Again.");

    const data = new FormData();
    data.append("email", userDetails.email);
    data.append("content", newPost.content);
    data.append("tags", newPost.tags);
    if (newPost.image) data.append("image", newPost.image);

    try {
      await axios.post(`${API_URL}/upload`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post uploaded successfully!");
      setTimeout(() => navigate(0), 2000);
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    }
  };

  const handleLikePost = (postId: string) => console.log("Like post:", postId);
  const handleCommentPost = (postId: string, comment: string) => console.log("Comment on post:", postId, comment);

  const filteredPosts = posts.filter(
    (post: any) =>
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xl font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pr-5">
      <Header isAuthenticated={true} />
      <div className="flex">
        <Sidebar />

        <main className="md:ml-24 ml-20">
          <div className="container py-8">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Main Feed */}
              <div className="lg:col-span-3 space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <h1 className="font-heading text-3xl font-bold">Dashboard</h1>

                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="btn-hero">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Post
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Create New Post</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="What's on your mind?"
                          name="content"
                          value={newPost.content}
                          onChange={handleChange}
                          className="min-h-[120px] resize-none"
                        />
                        <Label className="py-3">Image</Label>
                        <Input
                          placeholder="Choose your image (optional)"
                          accept="image/*"
                          type="file"
                          onChange={handleFileChange}
                          name="image"
                        />
                        <Input
                          placeholder="Tags (comma separated)"
                          name="tags"
                          value={newPost.tags}
                          onChange={handleChange}
                        />
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSubmit} className="btn-hero">
                            Post
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts, users, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Posts Feed */}
                <div className="space-y-6">
                  {filteredPosts.length > 0 && userDetails?.email ? (
                    filteredPosts.map((post: any) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        email={userDetails.email}
                        onLike={handleLikePost}
                        onComment={handleCommentPost}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No posts found matching your search.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="space-y-6">
                {/* Trending Topics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Trending HashTags
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {hashTagsAnalytics.map((tag, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">#{tag}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Active Users</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {activeUsers.map((user: any) => (
                      <div key={user.id} className="flex justify-between">
                        <span>{user.name}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
