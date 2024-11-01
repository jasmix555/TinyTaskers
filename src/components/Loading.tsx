import Image from "next/image";

export default function Loading() {
  return (
    <div className="relative flex h-screen flex-col items-center justify-center text-gray-500">
      <div className="relative h-[50vh] w-full">
        <Image fill alt="loading" src="/hamster_loading.svg" style={{objectFit: "contain"}} />
      </div>
      <p>Loading...</p>
    </div>
  );
}
