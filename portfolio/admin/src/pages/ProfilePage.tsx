import { useEffect, useRef, useState } from "react";
import { Save, Upload, User, FileText, X } from "lucide-react";
import api, { storageUrl } from "../api/axios";
import Toast from "../components/Toast";

interface Profile {
  id?: number;
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
  { key: "name", label: "Nom complet", placeholder: "Allouko Daniel Ange" },
  { key: "title", label: "Titre", placeholder: "Développeur Full Stack" },
  { key: "email", label: "Email", placeholder: "hello@...", type: "email" },
  { key: "phone", label: "Téléphone", placeholder: "+225 07 98 25 16 38" },
  {
    key: "location",
    label: "Localisation",
    placeholder: "Abidjan, Côte d'Ivoire",
  },
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
];

export default function ProfilePage() {
  const [form, setForm] = useState<Profile>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileId, setProfileId] = useState<number | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");

  const photoRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api
      .get("/profile")
      .then((r) => {
        const data = r.data;
        const p = Array.isArray(data) ? data[0] : data;
        if (p) {
          setForm(p);
          setProfileId(p.id ?? null);
          // ✅ Utiliser storageUrl pour afficher la photo existante
          setPhotoPreview(storageUrl(p.photo_url));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (k: keyof Profile, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    // Aperçu local immédiat (pas besoin du serveur)
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvFile(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k !== "id" && v !== undefined && v !== null)
          fd.append(k, String(v));
      });
      if (photoFile) fd.append("photo_file", photoFile);
      if (cvFile) fd.append("cv_file", cvFile);

      let saved;
      if (profileId) {
        fd.append("_method", "PUT");
        const res = await api.post(`/profile/${profileId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        saved = res.data;
      } else {
        const res = await api.post("/profile", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        saved = res.data;
        setProfileId(saved.id ?? null);
      }

      setForm(saved);
      // Mettre à jour l'aperçu avec l'URL du serveur
      setPhotoPreview(storageUrl(saved.photo_url));
      setPhotoFile(null);
      setCvFile(null);
      setToast({ msg: "Profil sauvegardé ✓", type: "success" });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setToast({
        msg: e?.response?.data?.message ?? "Erreur lors de la sauvegarde",
        type: "error",
      });
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
        {/* ── Photo + aperçu ── */}
        <div className="profile-preview">
          <div
            className="profile-avatar"
            style={{
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
            onClick={() => photoRef.current?.click()}
            title="Cliquer pour changer la photo"
          >
            {photoPreview ? (
              <img
                src={photoPreview}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <User size={24} color="var(--text-muted)" />
            )}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transition: "0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
            >
              <Upload size={16} color="#fff" />
            </div>
          </div>

          <div>
            <p className="profile-preview-name">
              {form.name || "Nom non défini"}
            </p>
            <p className="profile-preview-title">
              {form.title || "Titre non défini"}
            </p>
            <button
              onClick={() => photoRef.current?.click()}
              style={{
                marginTop: 5,
                fontSize: "0.73rem",
                color: "var(--accent)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {photoFile ? `✓ ${photoFile.name}` : "Changer la photo"}
            </button>
          </div>

          {profileId && (
            <span
              style={{
                marginLeft: "auto",
                fontSize: "0.72rem",
                color: "var(--text-muted)",
              }}
            >
              ID #{profileId}
            </span>
          )}
        </div>

        {/* Inputs fichiers cachés */}
        <input
          ref={photoRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: "none" }}
          onChange={handlePhotoChange}
        />
        <input
          ref={cvRef}
          type="file"
          accept=".pdf"
          style={{ display: "none" }}
          onChange={handleCvChange}
        />

        {/* ── Champs texte ── */}
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
                value={String(form[f.key] ?? "")}
                placeholder={f.placeholder}
                onChange={(e) => set(f.key, e.target.value)}
              />
            </div>
          ))}

          {/* ── Upload CV ── */}
          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label className="form-label">
              Curriculum Vitae (PDF uniquement)
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <button
                className="btn btn-ghost"
                onClick={() => cvRef.current?.click()}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <Upload size={14} />
                {cvFile ? cvFile.name : "Choisir un CV (PDF)"}
              </button>

              {/* CV actuel sur le serveur */}
              {form.cv_url && !cvFile && (
                <a
                  href={storageUrl(form.cv_url)}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: "0.8rem",
                    color: "var(--accent)",
                    textDecoration: "none",
                  }}
                >
                  <FileText size={14} /> Voir le CV actuel
                </a>
              )}

              {/* Nouveau CV sélectionné */}
              {cvFile && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <FileText size={14} color="var(--accent)" />
                  <span style={{ fontSize: "0.8rem", color: "var(--accent)" }}>
                    {cvFile.name}
                  </span>
                  <button
                    onClick={() => {
                      setCvFile(null);
                      if (cvRef.current) cvRef.current.value = "";
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-muted)",
                      display: "flex",
                    }}
                  >
                    <X size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Bio ── */}
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
