// HomePage.tsx
"use client";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {collection, getDocs, doc, getDoc} from "firebase/firestore";
import {onAuthStateChanged} from "firebase/auth";

import UserGreeting from "@/components/UserGreeting";
import ChildrenList from "@/components/ChildrenList";
import LogoutButton from "@/components/LogoutButton";
import {auth, db} from "@/api/firebase";
import {Child} from "@/types/ChildProps";
import {User} from "@/types/UserProps";

const HomePage = () => {
  const [registeredChildren, setRegisteredChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

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

  useEffect(() => {
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

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchChildren(currentUser.uid);
        fetchUserData(currentUser.uid);
      } else {
        router.push("/welcome");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleRegisterChildClick = () => {
    router.push("/child-registration");
  };

  const handleEditChild = (child: Child) => {
    router.push(`/child-registration?id=${child.id}`);
  };

  const handleDeleteChild = async (childId: string) => {
    console.log("Deleting child with ID:", childId);

    setRegisteredChildren((prev) => prev.filter((child) => child.id !== childId));

    const currentUser = auth.currentUser;

    if (currentUser) {
      await fetchChildren(currentUser.uid);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md p-4">
      <UserGreeting user={user} />
      <h2 className="mb-4 mt-8 text-xl font-bold">Registered Children</h2>
      <ChildrenList
        registeredChildren={registeredChildren}
        onDelete={handleDeleteChild}
        onEdit={handleEditChild}
      />
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
