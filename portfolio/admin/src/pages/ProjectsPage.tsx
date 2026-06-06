import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  FolderOpen,
  ExternalLink,
  Link,
} from "lucide-react";
import api from "../api/axios";
import Modal from "../components/Modal";
import Toast from "../components/Toast";

// ✅ Aligné sur la BD : github_link, live_link, technologies (json), featured
interface Project {
  id?: number;
  title: string;
  description: string;
  technologies: string; // saisie CSV → envoyé comme tableau
  image_url: string;
  github_link: string; // ✅ BD : github_link
  live_link: string; // ✅ BD : live_link
  featured: boolean;
}
const empty: Project = {
  title: "",
  description: "",
  technologies: "",
  image_url: "",
  github_link: "",
  live_link: "",
  featured: false,
};

export default function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Project>(empty);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const load = () =>
    api
      .get("/projects")
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  const openEdit = (p: Project) => {
    setEditing({
      ...p,
      // technologies peut être un tableau JSON depuis Laravel
      technologies: Array.isArray(p.technologies)
        ? p.technologies.join(", ")
        : p.technologies || "",
    });
    setModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...editing,
      // Convertir CSV → tableau pour la colonne JSON de la BD
      technologies: editing.technologies
        ? editing.technologies
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };
    try {
      editing.id
        ? await api.put(`/projects/${editing.id}`, payload)
        : await api.post("/projects", payload);
      setModal(false);
      load();
      setToast({ msg: "Projet sauvegardé ✓", type: "success" });
    } catch {
      setToast({ msg: "Erreur", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce projet ?")) return;
    try {
      await api.delete(`/projects/${id}`);
      load();
      setToast({ msg: "Supprimé ✓", type: "success" });
    } catch {
      setToast({ msg: "Erreur", type: "error" });
    }
  };

  const set = (k: keyof Project, v: string | boolean) =>
    setEditing((e) => ({ ...e, [k]: v }));

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
          <h1 className="page-title">Gestion des Projets</h1>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditing(empty);
            setModal(true);
          }}
        >
          <Plus size={15} />
          Ajouter
        </button>
      </div>

      {loading ? (
        <div className="loading-center">
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
        </div>
      ) : items.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">
            <FolderOpen size={40} />
          </div>
          <p>Aucun projet.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {items.map((p) => (
            <div className="card project-card" key={p.id}>
              <div
                className="project-preview"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(232,255,71,0.08), var(--bg-card))",
                }}
              >
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title} />
                ) : (
                  <FolderOpen
                    size={30}
                    color="#e8ff47"
                    style={{ opacity: 0.3 }}
                  />
                )}
                {p.featured && (
                  <span className="badge-accent project-featured">
                    Featured
                  </span>
                )}
                <div className="project-card-actions">
                  <button className="btn-icon" onClick={() => openEdit(p)}>
                    <Pencil size={13} />
                  </button>
                  <button
                    className="btn-icon danger"
                    onClick={() => handleDelete(p.id!)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="project-info">
                <p className="project-card-title">{p.title}</p>
                <p className="project-card-desc">{p.description}</p>
                {Array.isArray(p.technologies) && p.technologies.length > 0 && (
                  <div className="tags" style={{ marginBottom: 8 }}>
                    {p.technologies.map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="project-card-links">
                  {p.live_link && (
                    <a href={p.live_link} target="_blank" rel="noreferrer">
                      <ExternalLink size={12} /> Live
                    </a>
                  )}
                  {p.github_link && (
                    <a href={p.github_link} target="_blank" rel="noreferrer">
                      <Link size={12} /> GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal
          title={editing.id ? "Modifier le projet" : "Nouveau projet"}
          onClose={() => setModal(false)}
        >
          <div className="form-group">
            <label className="form-label">Titre</label>
            <input
              className="form-input"
              value={editing.title}
              placeholder="Portfolio Personnel"
              onChange={(e) => set("title", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={editing.description}
              placeholder="Description du projet..."
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Technologies (séparées par virgule)
            </label>
            <input
              className="form-input"
              value={editing.technologies}
              placeholder="React, Laravel, MySQL"
              onChange={(e) => set("technologies", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              className="form-input"
              value={editing.image_url}
              placeholder="https://..."
              onChange={(e) => set("image_url", e.target.value)}
            />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">URL Live</label>
              <input
                className="form-input"
                value={editing.live_link}
                placeholder="https://..."
                onChange={(e) => set("live_link", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input
                className="form-input"
                value={editing.github_link}
                placeholder="https://github.com/..."
                onChange={(e) => set("github_link", e.target.value)}
              />
            </div>
          </div>
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={editing.featured}
              onChange={(e) => set("featured", e.target.checked)}
            />
            Projet mis en avant
          </label>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={() => setModal(false)}>
              Annuler
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
