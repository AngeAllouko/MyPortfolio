import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Briefcase } from "lucide-react";
import api from "../api/axios";
import Modal from "../components/Modal";
import Toast from "../components/Toast";

interface Experience {
  id?: number;
  position: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  tags: string;
}
const empty: Experience = {
  position: "",
  company: "",
  location: "",
  start_date: "",
  end_date: "",
  is_current: false,
  description: "",
  tags: "",
};

const fmt = (d: string) =>
  d
    ? new Date(d).toLocaleDateString("fr-FR", {
        month: "short",
        year: "numeric",
      })
    : "";

export default function ExperiencesPage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Experience>(empty);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const load = () =>
    api
      .get("/experiences")
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  const openEdit = (e: Experience) => {
    setEditing({
      ...e,
      tags: Array.isArray(e.tags) ? e.tags.join(", ") : e.tags || "",
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
        ? await api.put(`/experiences/${editing.id}`, payload)
        : await api.post("/experiences", payload);
      setModal(false);
      load();
      setToast({ msg: "Expérience sauvegardée ✓", type: "success" });
    } catch {
      setToast({ msg: "Erreur", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ?")) return;
    try {
      await api.delete(`/experiences/${id}`);
      load();
      setToast({ msg: "Supprimé ✓", type: "success" });
    } catch {
      setToast({ msg: "Erreur", type: "error" });
    }
  };

  const set = (k: keyof Experience, v: string | boolean) =>
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
          <h1 className="page-title">Gestion des Expériences</h1>
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
            <Briefcase size={40} />
          </div>
          <p>Aucune expérience. Ajoutes-en une !</p>
        </div>
      ) : (
        <div className="card list">
          {items.map((exp) => (
            <div className="list-item" key={exp.id}>
              <div className="list-item-left">
                <div
                  className="item-icon"
                  style={{ background: "var(--blue-dim)" }}
                >
                  <Briefcase size={17} color="var(--blue)" />
                </div>
                <div className="item-body">
                  <p className="item-title">{exp.position}</p>
                  <p className="item-subtitle">
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </p>
                  <p className="item-meta">
                    {fmt(exp.start_date)} —{" "}
                    {exp.is_current ? "Présent" : fmt(exp.end_date)}
                  </p>
                  {exp.description && (
                    <p className="item-desc">{exp.description}</p>
                  )}
                  {Array.isArray(exp.tags) && exp.tags.length > 0 && (
                    <div className="tags">
                      {exp.tags.map((t) => (
                        <span className="tag" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="item-actions">
                <button className="btn-icon" onClick={() => openEdit(exp)}>
                  <Pencil size={14} />
                </button>
                <button
                  className="btn-icon danger"
                  onClick={() => handleDelete(exp.id!)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal
          title={editing.id ? "Modifier" : "Nouvelle expérience"}
          onClose={() => setModal(false)}
        >
          <div className="form-group">
            <label className="form-label">Poste</label>
            <input
              className="form-input"
              value={editing.position}
              placeholder="Frontend Developer"
              onChange={(e) => set("position", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Entreprise</label>
            <input
              className="form-input"
              value={editing.company}
              placeholder="Acme Corp"
              onChange={(e) => set("company", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Lieu</label>
            <input
              className="form-input"
              value={editing.location}
              placeholder="Abidjan, CI"
              onChange={(e) => set("location", e.target.value)}
            />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Date début</label>
              <input
                className="form-input"
                type="date"
                value={editing.start_date}
                onChange={(e) => set("start_date", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date fin</label>
              <input
                className="form-input"
                type="date"
                value={editing.end_date}
                disabled={editing.is_current}
                onChange={(e) => set("end_date", e.target.value)}
              />
            </div>
          </div>
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={editing.is_current}
              onChange={(e) => set("is_current", e.target.checked)}
            />{" "}
            Poste actuel
          </label>
          <div className="form-group">
            <label className="form-label">Tags (séparés par virgule)</label>
            <input
              className="form-input"
              value={editing.tags}
              placeholder="React, CSS, Figma"
              onChange={(e) => set("tags", e.target.value)}
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
