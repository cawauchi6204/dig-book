export const SwipeGuide = () => {
  return (
    <div className="fixed left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-4 w-[90vw] max-w-[400px]">
      <div className="flex flex-col gap-2">
        <p className="flex items-center gap-2 text-gray-700">
          <span className="inline-block w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-sm">
            ↑
          </span>
          <span>open link</span>
        </p>
        <p className="flex items-center gap-2 text-gray-700">
          <span className="inline-block w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-sm">
            →
          </span>
          <span>add to favorites</span>
        </p>
        <p className="flex items-center gap-2 text-gray-700">
          <span className="inline-block w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-sm">
            ←
          </span>
          <span>not interested</span>
        </p>
      </div>
    </div>
  );
};