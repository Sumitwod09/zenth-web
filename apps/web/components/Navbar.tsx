import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Image src="/logo/logo-icon-1024.png" alt="Zenth" width={32} height={32} className="navbar-logo" />
        <span className="navbar-name">Zenth</span>
      </div>
      <a href="#download" className="navbar-cta">
        Download App <ArrowRight size={16} />
      </a>
    </nav>
  );
}
