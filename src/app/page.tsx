"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const totalStickers = 10;
  const [currentStickers, setCurrentStickers] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // 컴포넌트가 마운트될 때 초기 스티커 개수를 가져옵니다.
  useEffect(() => {
    const fetchStickers = async () => {
      try {
        const res = await fetch("/api/stickers");
        const data = await res.json();
        if (res.ok) {
          setCurrentStickers(data.count);
          if (data.count >= totalStickers) {
            setShowCelebration(true);
          }
        } else {
          console.error("Failed to fetch stickers:", data.error);
        }
      } catch (error) {
        console.error("Error fetching stickers:", error);
      }
    };
    fetchStickers();
  }, []);

  // 스티커 개수가 변경될 때마다 축하 애니메이션 표시 여부를 업데이트합니다.
  useEffect(() => {
    if (currentStickers >= totalStickers) {
      setShowCelebration(true);
    } else {
      setShowCelebration(false);
    }
  }, [currentStickers, totalStickers]);

  const handleAddSticker = async () => {
    if (currentStickers < totalStickers) {
      try {
        const res = await fetch("/api/stickers", {
          method: "POST",
        });
        const data = await res.json();
        if (res.ok) {
          setCurrentStickers(data.count);
        } else {
          console.error("Failed to add sticker:", data.error);
        }
      } catch (error) {
        console.error("Error adding sticker:", error);
      }
    }
  };

  const handleResetStickers = async () => {
    try {
      const res = await fetch("/api/stickers", {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentStickers(data.count);
        setShowCelebration(false);
      } else {
        console.error("Failed to reset stickers:", data.error);
      }
    } catch (error) {
      console.error("Error resetting stickers:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 font-sans p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-500">칭찬 스티커판</h1>
          <p className="text-lg text-gray-600 mt-2">
            스티커 10개를 모으면 키즈카페 가자! 🚀
          </p>
        </header>

        <main>
          <div className="grid grid-cols-5 gap-4 mb-8">
            {Array.from({ length: totalStickers }).map((_, index) => (
              <div
                key={index}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all duration-300 ${
                  index < currentStickers
                    ? "bg-yellow-400 scale-110"
                    : "bg-gray-200"
                }`}
              >
                {index < currentStickers ? "🎉" : ""}
              </div>
            ))}
          </div>

          <div className="text-center mb-8">
            <p className="text-xl font-semibold text-gray-700">
              현재 스티커: {currentStickers}개 / {totalStickers}개
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleAddSticker}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
              disabled={currentStickers >= totalStickers}
            >
              스티커 붙이기 ✨
            </button>
            <button
              onClick={handleResetStickers}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              새로 시작
            </button>
          </div>

          {showCelebration && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-xl text-center animate-bounce">
                <h2 className="text-5xl font-extrabold text-green-600 mb-4">목표 달성!</h2>
                <p className="text-2xl text-gray-800">키즈카페 가자! 🥳</p>
                <button
                  onClick={() => setShowCelebration(false)}
                  className="mt-6 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-md"
                >
                  닫기
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
