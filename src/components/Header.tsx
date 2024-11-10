import Link from "next/link";

export default function Header() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">DigBook</h1>
          <nav className="hidden sm:block">
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="hover:text-gray-600">
                  ホーム
                </Link>
              </li>
              <li>
                <a href="/library" className="hover:text-gray-600">
                  ライブラリ
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <div className="h-16"></div>
    </>
  );
}
