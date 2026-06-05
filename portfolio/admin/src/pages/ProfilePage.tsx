import { useEffect, useState } from "react";
import { Save, User } from "lucide-react";
import api from "../api/axios";
import Toast from "../components/Toast";

interface Profile {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  github_url: string;
  photo_url: string;
  cv_url: string;
}
const empty: Profile = {
  name: "",
  title: "",
  bio: "",
  email: "",
  phone: "",
  location: "",
  linkedin_url: "",
  github_url: "",
  photo_url: "",
  cv_url: "",
};

const fields: {
  key: keyof Profile;
  label: string;
  placeholder: string;
  type?: string;
}[] = [
  { key: "name", label: "Nom complet", placeholder: "Vanshika M." },
  {
    key: "title",
    label: "Titre",
    placeholder: "Frontend Developer & Designer",
  },
  { key: "email", label: "Email", placeholder: "hello@...", type: "email" },
  { key: "phone", label: "Téléphone", placeholder: "+225 ..." },
  { key: "location", label: "Localisation", placeholder: "Abidjan, CI" },
  {
    key: "linkedin_url",
    label: "LinkedIn URL",
    placeholder: "https://linkedin.com/in/...",
  },
  {
    key: "github_url",
    label: "GitHub URL",
    placeholder: "https://github.com/...",
  },
  { key: "photo_url", label: "Photo URL", placeholder: "https://..." },
  { key: "cv_url", label: "CV URL", placeholder: "https://..." },
];

export default function ProfilePage() {
  const [form, setForm] = useState<Profile>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [exists, setExists] = useState(false);

  useEffect(() => {
    api
      .get("/profile")
      .then((r) => {
        setForm(r.data);
        setExists(true);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (k: keyof Profile, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      exists
        ? await api.put("/profile/1", form)
        : await api.post("/profile", form);
      setExists(true);
      setToast({ msg: "Profil sauvegardé ✓", type: "success" });
    } catch {
      setToast({ msg: "Erreur lors de la sauvegarde", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="loading-center">
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
      </div>
    );

  return (
    <div>
      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="page-header">
        <div>
          <span className="page-tag">Admin</span>
          <h1 className="page-title">Gestion du Profil</h1>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          <Save size={15} />
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>

      <div className="card">
        {/* Aperçu */}
        <div className="profile-preview">
          <div className="profile-avatar">
            {form.photo_url ? (
              <img src={form.photo_url} alt="" />
            ) : (
              <User size={24} color="var(--text-muted)" />
            )}
          </div>
          <div>
            <p className="profile-preview-name">
              {form.name || "Nom non défini"}
            </p>
            <p className="profile-preview-title">
              {form.title || "Titre non défini"}
            </p>
          </div>
        </div>

        {/* Champs */}
        <div
          style={{
            padding: "0 22px 22px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
          }}
        >
          {fields.map((f) => (
            <div className="form-group" key={f.key}>
              <label className="form-label">{f.label}</label>
              <input
                className="form-input"
                type={f.type || "text"}
                value={form[f.key]}
                placeholder={f.placeholder}
                onChange={(e) => set(f.key, e.target.value)}
              />
            </div>
          ))}
          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label className="form-label">Bio</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={form.bio}
              placeholder="Parle de toi..."
              onChange={(e) => set("bio", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
