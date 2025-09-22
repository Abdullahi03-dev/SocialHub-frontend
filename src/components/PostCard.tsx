// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { 
//   Heart, 
//   // MessageCircle, 
//   // Share2, 
//   // Edit, 
//   // Trash2, 
//   // MoreHorizontal,
//   Send
// } from "lucide-react";
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu";
// import { Textarea } from "@/components/ui/textarea";
// import axios from "axios";

// interface Comment {
//   id: string;
//   author: string;
//   avatar: string;
//   content: string;
//   timestamp: string;
// }
// interface User{
//   name:string;
//   role:string;
// }
// interface Post {
//   id: string;
//   author: string;
//   avatar: string;
//   content: string;
//   image?: string;
//   timestamp: string;
//   likes: number;
//   comments: Comment[];
//   hashtags?: string;
//   user:User
// }

// interface PostCardProps {
//   post: Post;
//   email:string;
//   onLike?: (postId: string) => void;
//   onComment?: (postId: string, comment: string) => void;
// }

// const PostCard = ({ post, onLike, onComment ,email}: PostCardProps) => {
//   const [newComment, setNewComment] = useState("");
//   const [liked, setLiked] = useState(false);
//   const [likes,setLikes]=useState(0)

//   useEffect(() => {
//     axios
//       .get(`http://127.0.0.1:8000/getLiked/${post.id}/liked/${email}`)
//       .then((res) => setLiked(res.data.liked))
//       .catch((err) => console.error(err));
//   }, [post.id, email]);










//   const handleLike =async () => {
//     try {
      
//     setLiked(!liked);
//     onLike?.(post.id);
//       const res = await axios.post(`http://127.0.0.1:8000/posts/${post.id}/like/${email}`);
//       console.log(res.data.likes)
//       // backend returns { "likes": number }
//       setLiked(!liked);
//     } catch (error) {
//       console.error("Error toggling like:", error);
//     }
    
//   };

//   const stringsToArray=(str:string)=>{
//     return str.split(',')
//   }

//   const handleComment = () => {
//     if (newComment.trim()) {
//       onComment?.(post.id, newComment);
//       setNewComment("");
//     }
//   };

//   return (
//     <Card className="card-post hover-lift w-[750px]">
//       <CardHeader className="flex-row items-start space-y-0 space-x-4 pb-4">
//         <Avatar className="h-10 w-10">
//           <AvatarFallback className="gradient-primary font-bold">{post.user.name.charAt(0).toUpperCase()}{post.user.name.charAt(1).toUpperCase()}</AvatarFallback>
//         </Avatar>
        
//         <div className="flex-1 space-y-1">
//           <div className="flex items-center justify-between">
//             <div>
//               <h4 className="font-semibold">{post.user.name}</h4>
//               <Badge 
//             variant={post.user.role === 'admin' ? 'default' : 'secondary'}
//             className={post.user.role === 'admin' ? 'gradient-primary text-white' : ''}
//           >
//             {post.user.role}
//           </Badge>
//             </div>
            

//           </div>
//         </div>
//       </CardHeader>

//       <CardContent className="space-y-4">
//         <p className="text-foreground leading-relaxed">{post.content}</p>
        
//         {post.image && (
//           <div className="rounded-lg overflow-hidden">
//             <img 
//               src={'http://127.0.0.1:8000/'+post.image} 
//               alt="Post content" 
//               className="w-full h-64 object-cover"
//             />
//           </div>
//         )}
        

//         {post.hashtags&& (
//           <div className="flex flex-wrap gap-2">
//             {stringsToArray(post.hashtags).map((tag, index) => (
//               <Badge key={index} variant="secondary">
//                 #{tag}
//               </Badge>
//             ))}
//           </div>
//         )}


//       </CardContent>

//       <CardFooter className="flex-col space-y-4">
//         <div className="flex items-center justify-between w-full">
//           <div className="flex items-center space-x-4">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={handleLike}
//               className={liked ? "text-red-500 hover:text-red-600" : ""}
//             >
//               <Heart className={`h-4 w-4 mr-1 ${liked ? "fill-current" : ""}`} />
//               {post.likes }
//             </Button>
//           </div>
//         </div>

        
//         {
//         // showComments
//         false 
//         && (
//           <div className="w-full space-y-4">
//             {/* Add comment */}
//             <div className="flex space-x-2">
//               <Textarea
//                 placeholder="Write a comment..."
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 className="min-h-[80px] resize-none"
//               />
//               <Button 
//                 onClick={handleComment}
//                 disabled={!newComment.trim()}
//                 size="sm"
//               >
//                 <Send className="h-4 w-4" />
//               </Button>
//             </div>
            
//             {/* Comments list */}
//             <div className="space-y-3">
//               {post.comments.map((comment) => (
//                 <div key={comment.id} className="flex space-x-3">
//                   <Avatar className="h-8 w-8">
//                     <AvatarImage src={comment.avatar} alt={comment.author} />
//                     <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1">
//                     <div className="bg-secondary rounded-lg p-3">
//                       <div className="flex items-center space-x-2 mb-1">
//                         <span className="font-medium text-sm">{comment.author}</span>
//                         <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
//                       </div>
//                       <p className="text-sm">{comment.content}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </CardFooter>
//     </Card>
//   );
// };

// export default PostCard;




import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

// Types
interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

interface User {
  name: string;
  role: string;
  image:string
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
  hashtags?: string;
  user: User;
}

interface PostCardProps {
  post: Post;
  email: string;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, comment: string) => void;
}

// Component
const PostCard = ({ post, onLike, onComment, email }: PostCardProps) => {
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  // Check if the current user has liked the post
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/getLiked/${post.id}/liked/${email}`)
      .then((res) => {
        setLiked(res.data.liked);
      })
      .catch((err) => console.error(err));
  }, [post.id, email]);

  // Toggle like
  const handleLike = async () => {
    // Temporary UI update
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));

    // Trigger parent callback
    onLike?.(post.id);

    // Backend call
    try {
      await axios.post(
        `http://127.0.0.1:8000/posts/${post.id}/like/${email}`
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  // Convert hashtags string to array
  const stringsToArray = (str: string) => str.split(",");

  // Handle comment submission
  const handleComment = () => {
    if (!newComment.trim()) return;
    onComment?.(post.id, newComment);
    setNewComment("");
  };

  return (
    <Card className="card-post hover-lift w-[750px]">

      <CardHeader className="flex-row items-start space-y-0 space-x-4 pb-4">
        <Avatar className="h-10 w-10">
            <AvatarImage
                src={
                    post.user?.image
                    ? "http://127.0.0.1:8000/" + post.user.image
                    : undefined
                    }
             alt={post.user?.name}
                            />
                    {post.user?.name && (
                       <AvatarFallback className="gradient-primary font-bold">
                      {post.user.name.charAt(0).toUpperCase()}
                      {post.user.name.charAt(1).toUpperCase()}
                            </AvatarFallback>
                            )}
                          </Avatar>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">{post.user.name}</h4>
              <Badge
                variant={post.user.role === "admin" ? "default" : "secondary"}
                className={post.user.role === "admin" ? "gradient-primary text-white" : ""}
              >
                {post.user.role}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Post Content: Text + Image + Hashtags */}
      <CardContent className="space-y-4">
        <p className="text-foreground leading-relaxed">{post.content}</p>

        {post.image && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={"http://127.0.0.1:8000/" + post.image}
              alt="Post content"
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {post.hashtags && (
          <div className="flex flex-wrap gap-2">
            {stringsToArray(post.hashtags).map((tag, idx) => (
              <Badge key={idx} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      {/* Post Footer: Likes + Comments */}
      <CardFooter className="flex space-y-4">
        <div className="flex items-center justify-items-start">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={liked ? "text-red-500 hover:text-red-600" : ""}
          >
            <Heart className={`h-4 w-4 mr-1 ${liked ? "fill-current" : ""}`} />
            {likes}
          </Button>
        </div>

        {/* Optional comment section */}
        {false && (
          <div className="w-full space-y-4">
            <div className="flex space-x-2">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <Button onClick={handleComment} disabled={!newComment.trim()} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;
