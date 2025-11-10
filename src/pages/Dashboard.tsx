import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, TrendingUp } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Label } from "@radix-ui/react-label";
import { useNavigate } from "react-router-dom";

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
  const [newPost, setNewPost] = useState<FormDataType>({
    content: "",
    tags: "",
    image: null,
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [hashTagsAnalytics, setHashTagsAnalytics] = useState<string[]>([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  // Axios instance with JWT header
  const axiosAuth = axios.create({
    baseURL: API_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  // Fetch hashtags
  const fetchHashTags = async () => {
    try {
      const res = await axiosAuth.get("/top-hashtags/");
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
      const res = await axiosAuth.get("/top-users/");
      setActiveUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch posts (authenticated)
  const fetchPosts = async () => {
    try {
      const res = await axiosAuth.get("/getallposts");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Session expired. Please login again.");
      // navigate("/auth");
    }
  };

  // Load all data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchHashTags(), fetchTopUsers(), fetchPosts()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPost({
      ...newPost,
      image: e.target.files?.[0] || null,
    });
  };

  const handleSubmit = async () => {
    if (!token) return toast.error("Please login again.");

    if (!newPost.content.trim() || !newPost.tags.trim() || !newPost.image) {
      return toast.error("Please fill in content, tags, and select an image.");
    }

    const data = new FormData();
    data.append("content", newPost.content);
    data.append("tags", newPost.tags);
    if (newPost.image) data.append("image", newPost.image);

    try {
      setSubmitting(true);
      await axiosAuth.post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post uploaded successfully!");
      setTimeout(() => navigate(0), 1500);
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPosts = posts.filter(
    (post: any) =>
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags
        ?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
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

        <main className="md:ml-24 ml-20 w-full">
          <div className="container py-8 max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Feed Section */}
              <div className="lg:col-span-3 w-full flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <h1 className="font-heading text-3xl font-bold">Posts</h1>

                  <Dialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                  >
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
                          <Button
                            variant="outline"
                            onClick={() => setIsCreateDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSubmit}
                            className="btn-hero"
                            disabled={submitting}
                          >
                            {submitting ? "Posting..." : "Post"}
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
                <div className="w-full flex flex-col gap-6">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post: any) => (
                      <div
                        key={post.id}
                        className="w-full border border-border bg-white rounded-lg p-4 shadow-sm"
                      >
                        <PostCard post={post} />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        No posts found matching your search.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Sidebar */}
              <aside className="space-y-6 w-full max-w-full lg:sticky lg:top-24 self-start">
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Trending HashTags
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    {hashTagsAnalytics.length > 0 ? (
                      hashTagsAnalytics.map((tag, index) => (
                        <span
                          key={index}
                          className="text-left font-medium text-sm"
                        >
                          #{tag}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-left">
                        No trending hashtags right now.
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Active Users</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    {activeUsers.length > 0 ? (
                      activeUsers.map((user: any) => (
                        <span key={user.id} className="text-left text-sm">
                          {user.name}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-left">
                        No active users to display.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
