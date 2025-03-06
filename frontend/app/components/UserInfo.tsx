import { useAuth } from "~/hooks/auth.hook";
import Button from "./ui/Button";
import { Link } from "react-router";

export default function UserInfo() {
  const { user } = useAuth();

  return (
    <div className="flex bg-indigo-950 p-4 h-16 justify-between items-center">
      <div className="text-xl cursor-default">{user.name}</div>
      <Link to="/logout"><Button size="square">Exit</Button></Link>
    </div>
  );
}
