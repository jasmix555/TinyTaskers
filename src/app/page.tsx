"use client"; // Ensure this file is a client component
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {collection, getDocs, doc, getDoc} from "firebase/firestore";
import {onAuthStateChanged} from "firebase/auth";

import UserGreeting from "@/components/UserGreeting";
import ChildPreview from "@/components/ChildPreview";
import LogoutButton from "@/components/LogoutButton";
import {auth, db} from "@/api/firebase";
import {Child} from "@/types/ChildProps";
import {User} from "@/types/UserProps";
import LoadingSpinner from "@/components/LoadingSpinner";

const HomePage = () => {
  const [registeredChildren, setRegisteredChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchChildren = async (uid: string) => {
      try {
        const childrenRef = collection(db, `users/${uid}/children`);
        const childrenSnapshot = await getDocs(childrenRef);
        const childrenData: Child[] = childrenSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Child[];

        setRegisteredChildren(childrenData);
      } catch (error) {
        console.error("Error fetching children: ", error);
      }
    };

    const fetchUserData = async (uid: string) => {
      try {
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data() as User;

          setUser(userData);
        } else {
          console.error("No such user document!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchChildren(currentUser.uid);
        fetchUserData(currentUser.uid);
      }
      setLoading(false); // Move this to after both fetch calls
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleRegisterChildClick = () => {
    router.push("/child-registration");
  };

  if (loading) {
    return <LoadingSpinner />; // Show loading spinner while fetching data
  }

  return (
    <div className="p-4">
      <UserGreeting user={user} />
      <h2 className="mb-4 mt-8 text-xl font-bold">Registered Children</h2>
      <div className="grid grid-cols-1 gap-4">
        {registeredChildren.map((child) => (
          <ChildPreview key={child.id} child={child} />
        ))}
      </div>
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
