// components/UserGreeting.tsx
import {User} from "@/types/UserProps"; // Adjust the import path as necessary

interface UserGreetingProps {
  user: User | null; // or User if you want to handle undefined elsewhere
}

const UserGreeting = ({user}: UserGreetingProps) => (
  <h1 className="text-2xl font-bold">Hello, {user?.username || "User"}!</h1>
);

export default UserGreeting;
