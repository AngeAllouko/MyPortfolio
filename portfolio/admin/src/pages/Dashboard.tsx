import { useEffect, useState } from "react";
import {
  User,
  Award,
  Briefcase,
  Star,
  FolderOpen,
  MessageSquare,
} from "lucide-react";
import api from "../api/axios";

interface Stats {
  diplomas: number;
  experiences: number;
  skills: number;
  projects: number;
  contacts: number;
}

const cards = [
  {
    key: "diplomas",
    label: "Diplômes",
    icon: Award,
    color: "var(--yellow)",
    bg: "var(--yellow-dim)",
  },
  {
    key: "experiences",
    label: "Expériences",
    icon: Briefcase,
    color: "var(--blue)",
    bg: "var(--blue-dim)",
  },
  {
    key: "skills",
    label: "Compétences",
    icon: Star,
    color: "var(--purple)",
    bg: "var(--purple-dim)",
  },
  {
    key: "projects",
    label: "Projets",
    icon: FolderOpen,
    color: "var(--green)",
    bg: "var(--green-dim)",
  },
  {
    key: "contacts",
    label: "Messages",
    icon: MessageSquare,
    color: "var(--pink)",
    bg: "var(--pink-dim)",
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    diplomas: 0,
    experiences: 0,
    skills: 0,
    projects: 0,
    contacts: 0,
  });
  const [profile, setProfile] = useState<{
    name: string;
    title: string;
    photo_url?: string;
  } | null>(null);

  useEffect(() => {
    Promise.allSettled([
      api.get("/profile"),
      api.get("/diplomas"),
      api.get("/experiences"),
      api.get("/skills"),
      api.get("/projects"),
      api.get("/contacts"),
    ]).then(([p, d, e, s, pr, c]) => {
      if (p.status === "fulfilled") setProfile(p.value.data);
      setStats({
        diplomas: d.status === "fulfilled" ? d.value.data.length : 0,
        experiences: e.status === "fulfilled" ? e.value.data.length : 0,
        skills: s.status === "fulfilled" ? s.value.data.length : 0,
        projects: pr.status === "fulfilled" ? pr.value.data.length : 0,
        contacts: c.status === "fulfilled" ? c.value.data.length : 0,
      });
    });
  }, []);

  return (
    <div>
      <div className="page-header" style={{ marginBottom: 28 }}>
        <div>
          <span className="page-tag">Bienvenue</span>
          <h1 className="page-title">{profile?.name ?? "Dashboard"}</h1>
        </div>
      </div>

      {/* Profile banner */}
      <div className="card profile-banner">
        <div className="profile-banner-avatar">
          {profile?.photo_url ? (
            <img src={profile.photo_url} alt="" />
          ) : (
            <User size={22} color="var(--text-muted)" />
          )}
        </div>
        <div>
          <p className="profile-banner-name">{profile?.name ?? "—"}</p>
          <p className="profile-banner-title">
            {profile?.title ?? "Profil non configuré"}
          </p>
        </div>
        <a href="/profile" className="profile-banner-link">
          Modifier →
        </a>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {cards.map(({ key, label, icon: Icon, color, bg }) => (
          <div key={key} className="card stat-card">
            <div className="stat-icon" style={{ background: bg }}>
              <Icon size={17} color={color} />
            </div>
            <div>
              <p className="stat-value">{stats[key as keyof Stats]}</p>
              <p className="stat-label">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
