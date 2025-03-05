import { X, Heart, Star } from "lucide-react";

export const SwipeGuide = () => {
  return (
    <div className="fixed left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5 w-[90vw] max-w-[400px] border border-gray-200">
      <h3 className="text-center font-bold text-lg mb-4 text-gray-800">スワイプガイド</h3>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 text-gray-700">
          <span className="inline-flex w-10 h-10 bg-white rounded-full border-2 border-[#007AFF] items-center justify-center text-[#007AFF]">
            <Star size={20} />
          </span>
          <span className="text-sm">上にスワイプ：リンクを開く</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <span className="inline-flex w-10 h-10 bg-white rounded-full border-2 border-[#4CD964] items-center justify-center text-[#4CD964]">
            <Heart size={20} />
          </span>
          <span className="text-sm">右にスワイプ：お気に入りに追加</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <span className="inline-flex w-10 h-10 bg-white rounded-full border-2 border-[#FF3B30] items-center justify-center text-[#FF3B30]">
            <X size={20} />
          </span>
          <span className="text-sm">左にスワイプ：興味なし</span>
        </div>
      </div>
    </div>
  );
};
