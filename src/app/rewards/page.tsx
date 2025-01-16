"use client";

import React, {useState, useEffect} from "react";
import {collection, addDoc, getDocs, updateDoc, deleteDoc, doc} from "firebase/firestore";
import {FaGift, FaPlus} from "react-icons/fa";
import {FaSackDollar} from "react-icons/fa6";

import {db} from "@/api/firebase";
import {useAuth, useFetchChildren} from "@/hooks";
import {TaskIcons} from "@/types/TaskProps"; // Import TaskIcons
import {Loading} from "@/components";

interface Reward {
  id: string;
  title: string;
  pointsRequired: number;
  dateAdded: Date;
  icon: string;
  availableFor: string[];
}

interface NewReward {
  id: string;
  title: string;
  pointsRequired: number;
  icon: string;
  availableFor: string[];
}

export default function RewardsPage() {
  const {user, loading: authLoading} = useAuth();
  const {children, error: childrenError} = useFetchChildren(user?.uid || "");

  const [newReward, setNewReward] = useState<NewReward>({
    id: "",
    title: "",
    pointsRequired: 0,
    icon: "",
    availableFor: [],
  });

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const handleAddReward = async () => {
    if (
      !newReward.title.trim() ||
      newReward.pointsRequired <= 0 ||
      !newReward.icon ||
      newReward.availableFor.length === 0
    ) {
      setError("すべての項目を正しく入力してください。");

      return;
    }

    setLoading(true);
    try {
      const rewardsRef = collection(db, "rewards");

      if (isEditMode) {
        const rewardDoc = doc(db, "rewards", newReward.id);

        await updateDoc(rewardDoc, {
          title: newReward.title,
          pointsRequired: newReward.pointsRequired,
          icon: newReward.icon,
          availableFor: newReward.availableFor,
        });

        setRewards((prevRewards) =>
          prevRewards.map((reward) =>
            reward.id === newReward.id ? {...reward, ...newReward} : reward,
          ),
        );
        setIsEditMode(false);
      } else {
        const rewardDocRef = await addDoc(rewardsRef, {
          title: newReward.title,
          pointsRequired: newReward.pointsRequired,
          icon: newReward.icon,
          availableFor: newReward.availableFor,
          dateAdded: new Date(),
        });

        const newRewardWithId = {
          id: rewardDocRef.id,
          title: newReward.title,
          pointsRequired: newReward.pointsRequired,
          icon: newReward.icon,
          availableFor: newReward.availableFor,
          dateAdded: new Date(),
        };

        setRewards((prevRewards) => [...prevRewards, newRewardWithId]);
      }

      setNewReward({
        id: "",
        title: "",
        pointsRequired: 0,
        icon: "",
        availableFor: [],
      });
      setError(null);
      setIsModalOpen(false);
    } catch (err) {
      setError("追加または更新に失敗しました。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRewards = async () => {
    try {
      const rewardsRef = collection(db, "rewards");
      const rewardsSnapshot = await getDocs(rewardsRef);
      const rewardsList: Reward[] = rewardsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        dateAdded: doc.data().dateAdded.toDate(),
      })) as Reward[];

      setRewards(rewardsList);
    } catch (err) {
      setError("報酬の読み込みに失敗しました。");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleEditReward = (id: string) => {
    const rewardToEdit = rewards.find((reward) => reward.id === id);

    if (rewardToEdit) {
      setNewReward({
        id: rewardToEdit.id,
        title: rewardToEdit.title,
        pointsRequired: rewardToEdit.pointsRequired,
        icon: rewardToEdit.icon,
        availableFor: rewardToEdit.availableFor,
      });
      setIsEditMode(true);
      setIsModalOpen(true);
    }
  };

  const handleDeleteReward = async (id: string) => {
    if (!id) {
      console.error("無効な報酬IDです。");
      setError("報酬IDが見つかりません。");

      return;
    }

    setLoading(true);
    try {
      const rewardDoc = doc(db, "rewards", id);

      await deleteDoc(rewardDoc);
      setRewards((prevRewards) => prevRewards.filter((reward) => reward.id !== id));
    } catch (err) {
      setError("報酬の削除に失敗しました。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto max-w-md p-4">
      <h1 className="mb-4 text-center text-2xl font-bold text-gray-900">ストア</h1>
      <div className="mb-4">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-300 px-4 py-2 text-2xl font-bold text-white shadow-md hover:bg-orange-400"
          onClick={() => {
            setIsEditMode(false);
            setIsModalOpen(true);
          }}
        >
          <span>
            <FaPlus />
          </span>
          欲しいものを追加する
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">
              {isEditMode ? "報酬を編集する" : "新しい報酬を追加する"}
            </h2>
            <div className="mb-4">
              <input
                className="mb-2 w-full rounded-lg border border-gray-300 p-2"
                placeholder="商品名を入力。。。"
                type="text"
                value={newReward.title}
                onChange={(e) => setNewReward({...newReward, title: e.target.value})}
              />
              <input
                className="w-full rounded-lg border border-gray-300 p-2"
                placeholder="必要なポイント"
                type="number"
                value={newReward.pointsRequired}
                onChange={(e) =>
                  setNewReward({...newReward, pointsRequired: parseInt(e.target.value)})
                }
              />
            </div>
            <label className="mb-2 block">
              アイコンを選択する
              <div className="grid max-h-52 grid-cols-3 gap-2 overflow-auto rounded-lg border border-gray-300 p-2">
                {TaskIcons.map((icon) => (
                  <button
                    key={icon.id}
                    aria-pressed={newReward.icon === icon.id}
                    className={`flex items-center justify-center rounded-md border ${
                      newReward.icon === icon.id
                        ? "border-blue-500 bg-blue-100"
                        : "border-transparent hover:bg-gray-100"
                    }`}
                    type="button"
                    onClick={() => setNewReward({...newReward, icon: icon.id})}
                  >
                    <div className="p-4 text-2xl">{React.createElement(icon.icon)}</div>
                  </button>
                ))}
              </div>
            </label>
            <label className="mb-2 block">
              子どもを選択する
              <select
                multiple
                className="w-full rounded-lg border border-gray-300 p-2"
                value={newReward.availableFor}
                onChange={(e) =>
                  setNewReward({
                    ...newReward,
                    availableFor: Array.from(e.target.selectedOptions, (option) => option.value),
                  })
                }
              >
                {children.map((child) => (
                  <option key={child.id} className="p-2" value={child.id}>
                    {child.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex justify-between">
              <button
                className="rounded-lg bg-gray-300 px-4 py-2 text-black"
                onClick={() => setIsModalOpen(false)}
              >
                キャンセル
              </button>
              <button
                className="rounded-lg bg-orange-300 px-4 py-2 text-white"
                onClick={handleAddReward}
              >
                {isEditMode ? "変更を保存する" : "報酬を追加する"}
              </button>
            </div>
          </div>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {childrenError && <p className="text-red-500">{childrenError}</p>}
      {loading ? (
        <p>報酬を読み込み中...</p>
      ) : rewards.length === 0 ? (
        <p className="text-center">登録された報酬がありません。</p>
      ) : (
        <ul>
          {rewards.map((reward, idx) => {
            const Icon = TaskIcons.find((icon) => icon.id === reward.icon)?.icon || FaGift;

            return (
              <li
                key={`${reward.id}-${idx}`}
                className="mb-4 flex items-center justify-between rounded-lg border-l border-r border-t border-gray-200 p-4 shadow-md"
              >
                <div className="flex items-center gap-2">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-3xl">
                    <Icon />
                  </div>
                  <div className="flex-1">
                    <p className="w-36 truncate font-bold">{reward.title}</p>
                    <p className="flex gap-1 text-gray-600">
                      <span>
                        <FaSackDollar className="text-md inline-block" />
                      </span>
                      <span className="text-lg">{reward.pointsRequired}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="rounded-lg bg-orange-300 px-4 py-2 text-white hover:bg-orange-400"
                    onClick={() => handleEditReward(reward.id)}
                  >
                    編集
                  </button>
                  <button
                    className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    onClick={() => handleDeleteReward(reward.id)}
                  >
                    削除
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
