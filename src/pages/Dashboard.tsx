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

// Mock data
// const mockPosts = [
//   {
//     id: "1",
//     author: "Sarah Johnson",
//     avatar: "https://images.unsplash.com/photo-1494790108755-2616b2e7cc5a?w=100&h=100&fit=crop&crop=face",
//     content: "Just launched my new portfolio website! It was built using React and TypeScript with a focus on accessibility and performance. Really excited to share it with the community.",
//     timestamp: "2 hours ago",
//     likes: 24,
//     comments: [
//       {
//         id: "c1",
//         author: "Mike Chen",
//         avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
//         content: "Looks amazing! The design is so clean and modern.",
//         timestamp: "1 hour ago"
//       }
//     ],
//     tags: ["webdev", "react", "portfolio"]
//   },
//   {
//     id: "2",
//     author: "Alex Rodriguez",
//     avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
//     content: "Beautiful sunset from my morning hike today. There's something magical about starting the day surrounded by nature.",
//     image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
//     timestamp: "4 hours ago",
//     likes: 56,
//     comments: [
//       {
//         id: "c2",
//         author: "Emma Wilson",
//         avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
//         content: "Absolutely stunning! Where was this taken?",
//         timestamp: "3 hours ago"
//       },
//       {
//         id: "c3",
//         author: "David Kim",
//         avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
//         content: "This makes me want to plan a hiking trip!",
//         timestamp: "2 hours ago"
//       }
//     ],
//     tags: ["nature", "hiking", "photography"]
//   },
//   {
//     id: "3",
//     author: "Jamie Taylor",
//     avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
//     content: "Tips for staying productive while working from home: 1) Create a dedicated workspace, 2) Set clear boundaries, 3) Take regular breaks, 4) Stay connected with your team. What works for you?",
//     timestamp: "1 day ago",
//     likes: 89,
//     comments: [
//       {
//         id: "c4",
//         author: "Lisa Park",
//         avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
//         content: "Great tips! I'd add: dress for work even at home.",
//         timestamp: "1 day ago"
//       }
//     ],
//     tags: ["productivity", "remote", "tips"]
//   }
// ];

// const trendingTopics = [
//   { tag: "webdev", posts: 1234 },
//   { tag: "react", posts: 856 },
//   { tag: "productivity", posts: 645 },
//   { tag: "photography", posts: 532 },
//   { tag: "nature", posts: 421 }
// ];


interface FormDataType {
  content: string;
  tags: string;
  image: File | null;
}
const Dashboard = () => {
  const navigate=useNavigate()
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newPost, setNewPost] = useState<FormDataType>({ content: "", tags: "",image:null});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [hashTagsAnalytics,setHashTagsAnalytics]=useState([])
  const [activeUsers,setActiveUsers]=useState([])
  const savedEmail=localStorage.getItem('email')


const fetchHashTags=async ()=>{
  try {
    const res = await axios.get("http://127.0.0.1:8000/top-hashtags/");
    // console.log(res.data)
    const flattags=res.data.map((tag:any)=>tag.split(',')).flat().map((tag:any)=>tag.trim())
    console.log(flattags)
    setHashTagsAnalytics(flattags);
  } catch (err) {
    console.error(err);
  }
}

const fetchTopUsers=async ()=>{
  try {
    const res = await axios.get("http://127.0.0.1:8000/top-users/");
    console.log(res.data);
    // setPosts(res.data);
    setActiveUsers(res.data)
  } catch (err) {
    console.error(err);
  }
}


useEffect(()=>{
  fetchHashTags()
  fetchTopUsers()
},[])



  // Handle text input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewPost({
      ...newPost,
      [e.target.name]: e.target.value,
    });
  };



  // FOR FETCHING ALL POSTS FROM USERS
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/getallposts/");
        console.log(res.data)
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPosts();
  }, []);




  // Handle file input (optional)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewPost({
        ...newPost,
        image: e.target.files[0],
      });
    } else {
      setNewPost({
        ...newPost,
        image: null,
      });
    }
  };




  const handleSubmit = async () => {
    if(!savedEmail) return toast.error('Account Not Found, Signin Again.')
    const data = new FormData();
    data.append("email", savedEmail);     // send email
    data.append("content", newPost.content);
    data.append("tags", newPost.tags);
  
    if (newPost.image) {
      data.append("image", newPost.image);
    }
    try {
      await axios.post("http://127.0.0.1:8000/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post uploaded successfully!");
      setTimeout(()=>{
        navigate(0);
          },2000)
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    }
  };

  // const handleEditPost = (postId: string) => {
  //   console.log('Edit post:', postId);
  // };

  // const handleDeletePost = (postId: string) => {
  //   setPosts(posts.filter(post => post.id !== postId));
  // };

  const handleLikePost = (postId: string) => {
    console.log('Like post:', postId);
  };

  const handleCommentPost = (postId: string, comment: string) => {
    console.log('Comment on post:', postId, comment);
  };



  const filteredPosts = posts.filter((post:any) =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    // post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags?.some((tag:string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background pr-5">
      <Header isAuthenticated={true} />
      
      <div className="flex">
        <Sidebar />
        
        <main className=" md:ml-24 ml-20">
          <div className="container py-8">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Main Feed */}
              <div className="lg:col-span-3 space-y-6">
                {/* Header Actions */}
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
                          placeholder="choose your image(optional)"
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
                          <Button
                           onClick={handleSubmit} 
                           className="btn-hero">
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
                  {filteredPosts.length > 0 && savedEmail? (
                    filteredPosts.map((post:any) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        // onEdit={handleEditPost}
                        // onDelete={handleDeletePost}
                        email={savedEmail}
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
                    
                      {activeUsers.map((user:any)=>(
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