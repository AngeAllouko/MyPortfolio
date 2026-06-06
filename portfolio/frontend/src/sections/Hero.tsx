import { useEffect, useState } from "react";
import api, { storageUrl } from "../api/axios";
import "./Hero.css";

interface Profile {
  name: string;
  title: string;
  bio: string;
  linkedin_url?: string;
  github_url?: string;
  photo_url?: string;
  cv_url?: string;
}

export default function Hero() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    api
      .get("/profile")
      .then((r) => {
        const d = r.data;
        setProfile(Array.isArray(d) ? d[0] : d);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="home" className="hero">
      <div className="hero-bg">
        <div className="hero-grid" />
        <div className="hero-glow" />
      </div>

      <div className="container hero-inner">
        <div className="hero-content">
          <p className="hero-greeting">
            Je suis{" "}
            <span className="hero-name-inline">{profile?.name ?? "—"}</span>
          </p>

          <h1 className="hero-title">
            {profile?.title ?? (
              <>
                Front-End
                <br />
                <span className="hero-title-outline">Developer</span>
                <span className="hero-title-amp"> &</span>
                <br />
                Designer
              </>
            )}
          </h1>

          <p className="hero-desc">{profile?.bio ?? ""}</p>

          <div className="hero-actions">
            {profile?.cv_url ? (
              <a
                href={storageUrl(profile.cv_url)}
                download
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Télécharger le CV
              </a>
            ) : (
              <a href="#contact" className="btn-primary">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Me contacter
              </a>
            )}
          </div>

          <div className="hero-socials">
            {profile?.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="social-link"
                aria-label="LinkedIn"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            )}
            {profile?.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noreferrer"
                className="social-link"
                aria-label="GitHub"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                </svg>
              </a>
            )}
          </div>
        </div>

        <div className="hero-photo-wrap">
          <div className="hero-photo-frame">
            {profile?.photo_url ? (
              <img
                src={storageUrl(profile.photo_url)}
                alt={profile.name}
                className="hero-photo"
              />
            ) : (
              <div className="photo-placeholder">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.3"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Photo à ajouter via l'admin</span>
              </div>
            )}
          </div>
          <div className="hero-photo-accent" />
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <div className="scroll-line" />
        <span>Défiler</span>
      </div>
    </section>
  );
}
