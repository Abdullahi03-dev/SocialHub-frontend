import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Mail, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  created_at: string;
  posts: number;
}

interface UserCardProps {
  user: UserData;
  onDelete?: (userId: string) => void;
  showDeleteButton?: boolean;
  variant?: "card" | "table";
  isAdmin:boolean;
}

const UserCard = ({ user, onDelete, showDeleteButton = false, variant = "card",isAdmin }: UserCardProps) => {
  const navigate=useNavigate()
  const handleDelete = () => {
    if (onDelete) {
      onDelete(user.id);
    }
  };

  if (variant === "table") {
    return (
      <tr className="border-b border-border hover:bg-secondary/50 transition-smooth cursor-pointer" onClick={()=>{navigate('/singlepage/'+user.id)}}>
        <td className="py-4 px-6">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </td>
        <td className="py-4 px-6">
          <Badge 
            variant={user.role === 'admin' ? 'default' : 'secondary'}
            className={user.role === 'admin' ? 'gradient-primary text-white' : ''}
          >
            {user.role}
          </Badge>
        </td>
  
        <td className="py-4 px-6 text-sm text-muted-foreground">
          {user.created_at}
        </td>
        <td className="py-4 px-6 text-sm text-muted-foreground">
          {user.posts}
        </td>
        <td className="py-4 px-6">
          {showDeleteButton &&isAdmin&& (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </td>
      </tr>
    );
  }

  return (
    <Card className="card-interactive hover-lift w-[270px]">
      <CardHeader className="text-center pb-4">
        <Avatar className="h-20 w-20 mx-auto mb-4">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h3 className="font-heading text-xl font-semibold">{user.name}</h3>
        <Badge 
          variant={user.role === 'admin' ? 'default' : 'secondary'}
          className={user.role === 'admin' ? 'gradient-primary text-white' : ''}
        >
          {user.role}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Mail className="h-4 w-4 mr-2" />
          {user.email}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          Joined {user.created_at}
        </div>

        {/* Stats */}
        <div className="grid grid-cols gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <p className="font-semibold">{user.posts}</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </div>
        </div>
      </CardContent>

      {showDeleteButton &&isAdmin&& (
        <CardFooter>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="w-full hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete User
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default UserCard;