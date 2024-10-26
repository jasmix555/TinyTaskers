"use client"; // Ensure this file is a client component
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {collection, getDocs, doc, getDoc} from "firebase/firestore";
import {onAuthStateChanged} from "firebase/auth";

import UserGreeting from "@/components/UserGreeting";
import ChildPreview from "@/components/ChildPreview";
import LogoutButton from "@/components/LogoutButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import {auth, db} from "@/api/firebase";
import {Child} from "@/types/ChildProps";
import {User} from "@/types/UserProps";

const HomePage = () => {
  const [registeredChildren, setRegisteredChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Function to fetch children data
    const fetchChildren = async (uid: string) => {
      try {
        const childrenRef = collection(db, `users/${uid}/children`);
        const childrenSnapshot = await getDocs(childrenRef);
        const childrenData = childrenSnapshot.docs.map(
          (doc) => ({id: doc.id, ...doc.data()}) as Child,
        );

        setRegisteredChildren(childrenData);
      } catch (error) {
        console.error("Error fetching children:", error);
      }
    };

    // Function to fetch user data
    const fetchUserData = async (uid: string) => {
      try {
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        } else {
          console.error("User document not found.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Authentication state listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchChildren(currentUser.uid);
        fetchUserData(currentUser.uid);
      } else {
        router.push("/welcome"); // Redirect to welcome page if not authenticated
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up subscription on component unmount
  }, [router]);

  // Handler for navigating to child registration page
  const handleRegisterChildClick = () => {
    router.push("/child-registration");
  };

  // Render loading spinner while fetching data
  if (loading) {
    return <LoadingSpinner />;
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
