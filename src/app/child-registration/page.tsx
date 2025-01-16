// ChildRegistration.tsx
"use client";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {onAuthStateChanged} from "firebase/auth";

import {Child} from "@/types/ChildProps";
import {ChildrenList, ChildForm} from "@/components";
import {useDeleteChild, useFetchChildren, useAuth, useCreateChild} from "@/hooks";
import {auth} from "@/api/firebase";

export default function ChildRegistration() {
  const {user} = useAuth();
  const {deleteChild} = useDeleteChild();
  const router = useRouter();

  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const {children: initialRegisteredChildren, loading} = useFetchChildren(user?.uid || "");
  const [registeredChildren, setRegisteredChildren] = useState<Child[]>(initialRegisteredChildren);

  const {handleChildSubmit} = useCreateChild(currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ? user.uid : null);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setRegisteredChildren(initialRegisteredChildren);
  }, [initialRegisteredChildren]);

  const handleSubmit = async (childData: Child) => {
    await handleChildSubmit(childData, editingChild, setRegisteredChildren);
    setEditingChild(null); // Reset editing state after submission
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteChild(id);
      setRegisteredChildren((prev) => prev.filter((child) => child.id !== id));
      setSuccessMessage("子供が正常に削除されました。");
      setTimeout(() => setSuccessMessage(null), 3000); // Auto-hide message
    } catch (error) {
      console.error("子供の削除中にエラーが発生しました:", error);
      setError("子供の削除に失敗しました。もう一度お試しください。");
    }
  };

  const handleFinishRegistering = () => {
    router.push("/");
  };

  return (
    <div className="container mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">子供の登録</h1>
      {error && <p className="text-red-500">{error}</p>} {/* エラーメッセージを表示 */}
      {successMessage && (
        <div className="mb-4 rounded bg-green-100 p-2 text-green-800">{successMessage}</div>
      )}{" "}
      {/* 成功メッセージを表示 */}
      <ChildForm editingChild={editingChild} onSubmit={handleSubmit} />
      <h2 className="mb-4 mt-6 text-xl font-bold">登録された子供たち</h2>
      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <ChildrenList registeredChildren={registeredChildren} onDelete={handleDelete} />
      )}
      <button
        className={`mt-4 rounded px-4 py-2 text-white ${
          registeredChildren.length > 0
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-500 hover:bg-gray-600"
        }`}
        onClick={handleFinishRegistering}
      >
        {registeredChildren.length > 0 ? "登録を完了する" : "ホームに戻る"}
      </button>
    </div>
  );
}
