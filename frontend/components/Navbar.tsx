import Link from "next/link";

export default function Navbar() {
  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{ backgroundColor: "#3A7858" }}
    >
      <div className="mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14">
        <Link
          href="/"
          className="font-extrabold tracking-tight text-xl text-white"
        >
          Rentify
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6 text-white/90 text-sm font-normal">
            <Link href="#" className="hover:text-white">
              Contact
            </Link>
            <Link href="#" className="hover:text-white">
              FAQ
            </Link>
          </nav>
          <Link
            href="/dashboard"
            className="rounded-full px-4 py-1.5 text-sm font-semibold text-white bg-[#2FA86E] hover:bg-[#27935F] shadow-sm transition-colors"
          >
            Logga in
          </Link>
        </div>
      </div>
    </header>
  );
}
