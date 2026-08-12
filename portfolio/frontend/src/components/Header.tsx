import { useState, useEffect } from "react";
import "./Header.css";

interface HeaderProps {
  activeSection: string;
}

const navLinks = [
  { id: "home", label: "Accueil" },
  { id: "services", label: "Services" },
  { id: "about", label: "À propos" },
  { id: "skills", label: "Compétences" },
  { id: "projects", label: "Projets" },
];

export default function Header({ activeSection }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-inner container">
        <button className="logo" onClick={() => scrollTo("home")}>
          <span className="logo-mark">AEDAN</span>
        </button>

        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              className={`nav-link ${activeSection === link.id ? "active" : ""}`}
              onClick={() => scrollTo(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <button className="cta-btn" onClick={() => scrollTo("contact")}>
          Me contacter
        </button>

        <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
