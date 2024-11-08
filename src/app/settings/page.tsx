"use client";

import {useAuth, useFetchUser} from "@/hooks";
import {UserGreeting, LogoutButton, Loading} from "@/components";
import {User as UserType} from "@/types/UserProps";

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
