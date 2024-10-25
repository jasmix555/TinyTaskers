import {useEffect, useState} from "react";
import {User} from "@supabase/supabase-js"; // Import User type

import {supabase} from "@/api/supabase";

type UseAuthReturn = {
  user: User | null;
  signOut: () => Promise<void>;
};

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null); // User or null

  useEffect(() => {
    const getUser = async () => {
      const {data} = await supabase.auth.getSession();

      setUser(data.session?.user || null);
    };

    getUser();

    const {data: authListener} = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe(); // Clean up the listener
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null); // Reset the user state
  };

  return {user, signOut};
};
