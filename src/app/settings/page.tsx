"use client";

import {useAuth, useFetchUser} from "@/hooks";
import UserGreeting from "@/components/UserGreeting";
import LogoutButton from "@/components/LogoutButton";
import {User as UserType} from "@/types/UserProps";
import Loading from "@/components/Loading";

export default function Settings() {
  const {user, loading: authLoading} = useAuth();

  const {user: fetchedUser, loading: userLoading} = useFetchUser(user?.uid || "");

  const displayUser = fetchedUser || (user ? {username: "", email: user.email} : null);

  if (authLoading || userLoading) {
    return <Loading />;
  }

  return (
    <div>
      <UserGreeting user={displayUser as UserType} />
      <LogoutButton />
    </div>
  );
}
