import Image from "next/image";
import ApplyLogo from "../../public/applyLogo.svg";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#404040] text-white py-14">
      <div className="flex justify-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image alt="Apply Logo" src={ApplyLogo} />
        </Link>
      </div>
    </footer>
  );
}
