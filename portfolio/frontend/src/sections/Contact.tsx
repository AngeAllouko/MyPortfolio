import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Contact.css";

interface Profile {
  name?: string;
  email?: string;
  location?: string;
  phone?: string;
  linkedin_url?: string;
  github_url?: string;
}
type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    api
      .get("/profile")
      .then((r) => {
        const d = r.data;
        setProfile(Array.isArray(d) ? d[0] : d);
      })
      .catch(() => {});
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("loading");
    try {
      await api.post("/contacts", {
        ...form,
        subject: form.subject || "Message depuis le portfolio",
      });
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="contact-inner">
          <div className="contact-left">
            <span className="section-tag">Contactez nous !</span>
            <h2 className="section-title">
              Travaillons
              <br />
              ensemble
            </h2>
            <p className="contact-desc">
              Vous avez un projet en tete ? Je serai ravi de l'entendre. Envoyez
              moi un message et créons quelque chose de génial.
            </p>
            <div className="contact-info">
              {profile?.email && (
                <div className="contact-info-item">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>{profile.email}</span>
                </div>
              )}
              {profile?.location && (
                <div className="contact-info-item">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{profile.location}</span>
                </div>
              )}
              {profile?.phone && (
                <div className="contact-info-item">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82 19.79 19.79 0 01.12 1.22 2 2 0 012.1 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.45-.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  <span>{profile.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="contact-form-wrap">
            {status === "success" ? (
              <div className="form-success">
                <span className="success-icon">✓</span>
                <p>Message envoyé ! Je vous recontacterai bientôt.</p>
              </div>
            ) : (
              <div className="contact-form">
                {status === "error" && (
                  <p style={{ color: "var(--accent)", fontSize: "0.85rem" }}>
                    Une erreur est survenue. Réessaie.
                  </p>
                )}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Votre nom</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Allouko Daniel"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Adresse Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="aaaa@gmail.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Objet</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Proposition de projet, question, collaboration etc."
                    value={form.subject}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Messages</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Parlez moi de votre projet..."
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>
                <button
                  className="form-submit"
                  onClick={handleSubmit}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Sending..." : "Envoyez un message"}
                  {status !== "loading" && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <footer className="site-footer">
          <p>
            © {new Date().getFullYear()} {profile?.name ?? "Portfolio"}.
            Designed & built with ♥
          </p>
          <div className="footer-links">
            {profile?.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            )}
            {profile?.github_url && (
              <a href={profile.github_url} target="_blank" rel="noreferrer">
                GitHub
              </a>
            )}
          </div>
        </footer>
      </div>
    </section>
  );
}
