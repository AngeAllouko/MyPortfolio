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

interface Project {
  id?: number;
  title: string;
  description: string;
  category: string;
  tags: string;
  image_url: string;
  live_url: string;
  github_url: string;
  accent_color: string;
  featured: boolean;
}
const empty: Project = {
  title: "",
  description: "",
  category: "",
  tags: "",
  image_url: "",
  live_url: "",
  github_url: "",
  accent_color: "#e8ff47",
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
      tags: Array.isArray(p.tags) ? p.tags.join(", ") : p.tags || "",
    });
    setModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...editing,
      tags: editing.tags
        ? editing.tags
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
          <p>Aucun projet. Ajoutes-en un !</p>
        </div>
      ) : (
        <div className="projects-grid">
          {items.map((p) => (
            <div className="card project-card" key={p.id}>
              <div
                className="project-preview"
                style={{
                  background: `linear-gradient(135deg, ${p.accent_color}18, var(--bg-card))`,
                }}
              >
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title} />
                ) : (
                  <FolderOpen
                    size={30}
                    color={p.accent_color}
                    style={{ opacity: 0.35 }}
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
                <p className="project-card-cat">{p.category}</p>
                <p className="project-card-desc">{p.description}</p>
                {Array.isArray(p.tags) && p.tags.length > 0 && (
                  <div className="tags" style={{ marginBottom: 8 }}>
                    {p.tags.map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="project-card-links">
                  {p.live_url && (
                    <a href={p.live_url} target="_blank" rel="noreferrer">
                      <ExternalLink size={12} /> Live
                    </a>
                  )}
                  {p.github_url && (
                    <a href={p.github_url} target="_blank" rel="noreferrer">
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
              placeholder="Mon projet"
              onChange={(e) => set("title", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Catégorie</label>
            <input
              className="form-input"
              value={editing.category}
              placeholder="UI/UX · Frontend"
              onChange={(e) => set("category", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={editing.description}
              placeholder="Description..."
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Tags (séparés par virgule)</label>
            <input
              className="form-input"
              value={editing.tags}
              placeholder="React, Figma..."
              onChange={(e) => set("tags", e.target.value)}
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
                value={editing.live_url}
                placeholder="https://..."
                onChange={(e) => set("live_url", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input
                className="form-input"
                value={editing.github_url}
                placeholder="https://github.com/..."
                onChange={(e) => set("github_url", e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Couleur accent</label>
            <div className="color-input-wrap">
              <input
                type="color"
                className="form-color"
                value={editing.accent_color}
                onChange={(e) => set("accent_color", e.target.value)}
              />
              <span className="color-value">{editing.accent_color}</span>
            </div>
          </div>
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={editing.featured}
              onChange={(e) => set("featured", e.target.checked)}
            />{" "}
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
