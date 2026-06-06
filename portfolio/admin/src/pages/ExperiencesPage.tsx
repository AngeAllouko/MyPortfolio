import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Briefcase } from "lucide-react";
import api from "../api/axios";
import Modal from "../components/Modal";
import Toast from "../components/Toast";

// ✅ Aligné sur la BD : job_title (pas "position"), company, start_date, end_date, description, location
interface Experience {
  id?: number;
  job_title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
}
const empty: Experience = {
  job_title: "",
  company: "",
  location: "",
  start_date: "",
  end_date: "",
  description: "",
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

  const handleSave = async () => {
    setSaving(true);
    try {
      editing.id
        ? await api.put(`/experiences/${editing.id}`, editing)
        : await api.post("/experiences", editing);
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

  const set = (k: keyof Experience, v: string) =>
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
          <p>Aucune expérience.</p>
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
                  <p className="item-title">{exp.job_title}</p>
                  <p className="item-subtitle">
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </p>
                  <p className="item-meta">
                    {fmt(exp.start_date)} —{" "}
                    {exp.end_date ? fmt(exp.end_date) : "Présent"}
                  </p>
                  {exp.description && (
                    <p className="item-desc">{exp.description}</p>
                  )}
                </div>
              </div>
              <div className="item-actions">
                <button
                  className="btn-icon"
                  onClick={() => {
                    setEditing(exp);
                    setModal(true);
                  }}
                >
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
            <label className="form-label">Intitulé du poste</label>
            <input
              className="form-input"
              value={editing.job_title}
              placeholder="Développeur Full Stack"
              onChange={(e) => set("job_title", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Entreprise</label>
            <input
              className="form-input"
              value={editing.company}
              placeholder="MIAGE, Acme Corp..."
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
              <label className="form-label">Date fin (vide = Présent)</label>
              <input
                className="form-input"
                type="date"
                value={editing.end_date}
                onChange={(e) => set("end_date", e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={editing.description}
              placeholder="Description du poste..."
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
