import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Award,
  Briefcase,
  Star,
  FolderOpen,
  MessageSquare,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: User, label: "Profil", path: "/profile" },
  { icon: Award, label: "Diplômes", path: "/diplomas" },
  { icon: Briefcase, label: "Expériences", path: "/experiences" },
  { icon: Star, label: "Compétences", path: "/skills" },
  { icon: FolderOpen, label: "Projets", path: "/projects" },
  { icon: MessageSquare, label: "Messages", path: "/contacts" },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>
          Admin <span>Portfolio</span>
        </h1>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={`sidebar-link${pathname === path ? " active" : ""}`}
          >
            <Icon size={17} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">Admin v1.0</div>
    </aside>
  );
}
