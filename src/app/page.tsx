"use client";
import {useRouter} from "next/navigation";

import {useAuth} from "@/hooks/useAuth";
import {useFetchChildren} from "@/hooks/useFetchChildren";
import {useFetchUser} from "@/hooks/useFetchUser";
import UserGreeting from "@/components/UserGreeting";
import ChildrenList from "@/components/ChildrenList";
import LogoutButton from "@/components/LogoutButton";
import {User as UserType} from "@/types/UserProps";

const HomePage = () => {
  const router = useRouter();
  const {user, loading: authLoading} = useAuth();

  // Fetch children and user data using hooks
  const {children, loading: childrenLoading} = useFetchChildren(user?.uid || "");
  const {user: fetchedUser, loading: userLoading} = useFetchUser(user?.uid || "");

  const handleRegisterChildClick = () => {
    router.push("/child-registration");
  };

  const handleDeleteChild = async (childId: string) => {
    console.log("Deleting child with ID:", childId);
  };

  // Loading state while auth, children or user data is being fetched
  if (authLoading || childrenLoading || userLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </div>
    );
  }

  // Type guard to ensure user is defined
  const displayUser = fetchedUser || (user ? {username: "", email: user.email} : null); // Default values if needed

  return (
    <div className="container mx-auto max-w-md p-4">
      <UserGreeting user={displayUser as UserType} />
      <h2 className="mb-4 mt-8 text-xl font-bold">Registered Children</h2>
      <ChildrenList registeredChildren={children} onDelete={handleDeleteChild} />{" "}
      <button
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        onClick={handleRegisterChildClick}
      >
        Register New Child
      </button>
      <LogoutButton />
    </div>
  );
};

export default HomePage;
