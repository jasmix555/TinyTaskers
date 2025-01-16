"use client";

import {ChangeEvent, useEffect, useState} from "react";
import {useRouter, useParams} from "next/navigation";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {FaCamera} from "react-icons/fa";
import {ref, uploadBytes, getDownloadURL, deleteObject} from "firebase/storage";
import {onAuthStateChanged} from "firebase/auth";
import Image from "next/image";

import {Child} from "@/types/ChildProps";
import {auth, db, storage} from "@/api/firebase";
import {Loading} from "@/components";

export default function ChildEditPage() {
  const [child, setChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPicture, setNewPicture] = useState<File | null>(null);
  const router = useRouter();
  const params = useParams();

  const childId = params.id as string;

  const fetchChildById = async (id: string, uid: string) => {
    try {
      console.log("IDで子供を取得中:", id, "ユーザー:", uid);
      const childRef = doc(db, `users/${uid}/children/${id}`);
      const childSnapshot = await getDoc(childRef);

      if (childSnapshot.exists()) {
        const childData = {id: childSnapshot.id, ...childSnapshot.data()} as Child;

        setChild(childData);
      } else {
        setError("子供が見つかりません。");
      }
    } catch (err) {
      console.error("子供の取得エラー:", err);
      setError("子供のデータ取得エラー。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && childId) {
        fetchChildById(childId, currentUser.uid);
      } else {
        console.log("ユーザーまたはchildIdがありません");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [childId]);

  const handleUpdate = async () => {
    if (!child) return;

    try {
      const updatedChild: Partial<Child> = {
        name: child.name,
        gender: child.gender,
        birthday: child.birthday,
        picture: child.picture,
      };

      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError("ユーザーが認証されていません");

        return;
      }

      const childRef = doc(db, `users/${currentUser.uid}/children/${child.id}`);

      // 新しい写真が選択された場合の写真アップロード処理
      if (newPicture) {
        const pictureRef = ref(
          storage,
          child.picture || `users/${currentUser.uid}/children/${child.id}/picture.jpg`,
        );

        // 古い写真が存在する場合は削除
        if (child.picture) {
          try {
            await deleteObject(pictureRef);
          } catch (error) {
            console.log("削除する古い写真がないか、削除エラー:", error);
          }
        }

        // 新しい写真をアップロード
        const snapshot = await uploadBytes(pictureRef, newPicture);
        const downloadURL = await getDownloadURL(snapshot.ref);

        updatedChild.picture = downloadURL;
      }

      await updateDoc(childRef, updatedChild);
      router.push("/");
    } catch (err) {
      console.error("子供の更新エラー:", err);
      setError("子供の情報更新に失敗しました。");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (child) {
      setChild({
        ...child,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handlePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewPicture(e.target.files[0]);
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 p-8 text-center">
          <p className="text-red-500">{error}</p>
          <button
            className="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            onClick={handleBack}
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p>子供のデータが利用できません。</p>
          <button
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={handleBack}
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">子供の情報を編集</h1>

      <div className="rounded-lg bg-white p-6 shadow-lg">
        {/* 円形の写真セクション */}
        <div className="relative mb-6 flex justify-center">
          <div className="group relative h-32 w-32 overflow-hidden rounded-full border-2 border-gray-300">
            {newPicture ? (
              <Image
                alt="子供"
                className="h-full w-full object-cover"
                height={200}
                src={URL.createObjectURL(newPicture)}
                width={200}
              />
            ) : (
              child.picture && (
                <Image
                  alt="子供"
                  className="h-full w-full object-cover"
                  height={200}
                  src={child.picture}
                  width={200}
                />
              )
            )}
            {!newPicture && !child.picture && (
              <div className="flex h-full w-full items-center justify-center bg-gray-200">
                <FaCamera className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black bg-opacity-0 transition-all group-hover:bg-opacity-50">
              <FaCamera className="hidden text-white group-hover:block" />
              <input
                accept="image/*"
                className="absolute inset-0 cursor-pointer opacity-0"
                type="file"
                onChange={handlePictureChange}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="name">
              名前
              <input
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                id="name"
                name="name"
                type="text"
                value={child.name}
                onChange={handleChange}
              />
            </label>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="gender">
              性別
              <select
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                id="gender"
                name="gender"
                value={child.gender}
                onChange={handleChange}
              >
                <option value="M">男性</option>
                <option value="F">女性</option>
              </select>
            </label>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="birthday">
              誕生日
              <input
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                id="birthday"
                name="birthday"
                type="date"
                value={child.birthday}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            className="rounded-md px-4 py-2 text-gray-600 hover:text-gray-800"
            onClick={handleBack}
          >
            キャンセル
          </button>
          <button
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={handleUpdate}
          >
            変更を保存
          </button>
        </div>
      </div>
    </div>
  );
}
