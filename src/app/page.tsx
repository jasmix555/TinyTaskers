"use client";
import {useRouter} from "next/navigation";
import {useState, useEffect} from "react";

import {useAuth, useDeleteChild, useFetchUser, useFetchChildren} from "@/hooks";
import UserGreeting from "@/components/UserGreeting";
import ChildrenList from "@/components/ChildComponents/ChildrenList";
import LogoutButton from "@/components/LogoutButton";
import {User as UserType} from "@/types/UserProps";
import {Child} from "@/types/ChildProps";
import Loading from "@/components/Loading";

const HomePage = () => {
  const router = useRouter();
  const {user, loading: authLoading} = useAuth();

  const {children: initialChildren, loading: childrenLoading} = useFetchChildren(user?.uid || "");
  const {user: fetchedUser, loading: userLoading} = useFetchUser(user?.uid || "");
  const {deleteChild} = useDeleteChild();

  // Local state to manage children data
  const [children, setChildren] = useState<Child[]>(initialChildren);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    setChildren(initialChildren);
  }, [initialChildren]);

  const handleRegisterChildClick = () => {
    router.push("/child-registration");
  };

  const handleDeleteChild = async (childId: string) => {
    try {
      await deleteChild(childId);

      // Update local state to remove the deleted child
      setChildren((prevChildren) => prevChildren.filter((child) => child.id !== childId));
      setSuccessMessage("Child deleted successfully.");
      setDeleteError(null);

      // Automatically hide the success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      setDeleteError("Failed to delete the child. Please try again.");
    }
  };

  if (authLoading || childrenLoading || userLoading) {
    return <Loading />;
  }

  const displayUser = fetchedUser || (user ? {username: "", email: user.email} : null);

  return (
    <div className="container mx-auto max-w-md p-4">
      <UserGreeting user={displayUser as UserType} />
      <h2 className="mb-4 mt-8 text-xl font-bold">Registered Children</h2>

      {/* Display success or error message */}
      {successMessage && (
        <div className="mb-4 rounded bg-green-100 p-2 text-green-800">{successMessage}</div>
      )}
      {deleteError && <div className="mb-4 rounded bg-red-100 p-2 text-red-800">{deleteError}</div>}

      <ChildrenList registeredChildren={children} onDelete={handleDeleteChild} />
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
