import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Award } from "lucide-react";
import api from "../api/axios";
import Modal from "../components/Modal";
import Toast from "../components/Toast";

// ✅ Aligné sur la BD : title, institution, year, description
interface Diploma {
  id?: number;
  title: string;
  institution: string;
  year: string;
  description: string;
}
const empty: Diploma = {
  title: "",
  institution: "",
  year: String(new Date().getFullYear()),
  description: "",
};

export default function DiplomasPage() {
  const [items, setItems] = useState<Diploma[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Diploma>(empty);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const load = () =>
    api
      .get("/diplomas")
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      editing.id
        ? await api.put(`/diplomas/${editing.id}`, editing)
        : await api.post("/diplomas", editing);
      setModal(false);
      load();
      setToast({
        msg: editing.id ? "Diplôme mis à jour ✓" : "Diplôme ajouté ✓",
        type: "success",
      });
    } catch {
      setToast({ msg: "Erreur", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce diplôme ?")) return;
    try {
      await api.delete(`/diplomas/${id}`);
      load();
      setToast({ msg: "Supprimé ✓", type: "success" });
    } catch {
      setToast({ msg: "Erreur", type: "error" });
    }
  };

  const set = (k: keyof Diploma, v: string) =>
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
          <h1 className="page-title">Gestion des Diplômes</h1>
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
            <Award size={40} />
          </div>
          <p>Aucun diplôme.</p>
        </div>
      ) : (
        <div className="card list">
          {items.map((d) => (
            <div className="list-item" key={d.id}>
              <div className="list-item-left">
                <div
                  className="item-icon"
                  style={{ background: "var(--yellow-dim)" }}
                >
                  <Award size={17} color="var(--yellow)" />
                </div>
                <div className="item-body">
                  <p className="item-title">{d.title}</p>
                  <p className="item-subtitle">{d.institution}</p>
                  <p className="item-meta">{d.year}</p>
                  {d.description && (
                    <p className="item-desc">{d.description}</p>
                  )}
                </div>
              </div>
              <div className="item-actions">
                <button
                  className="btn-icon"
                  onClick={() => {
                    setEditing(d);
                    setModal(true);
                  }}
                >
                  <Pencil size={14} />
                </button>
                <button
                  className="btn-icon danger"
                  onClick={() => handleDelete(d.id!)}
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
          title={editing.id ? "Modifier le diplôme" : "Nouveau diplôme"}
          onClose={() => setModal(false)}
        >
          <div className="form-group">
            <label className="form-label">Titre du diplôme</label>
            <input
              className="form-input"
              value={editing.title}
              placeholder="Master MIAGE, Licence..."
              onChange={(e) => set("title", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Établissement</label>
            <input
              className="form-input"
              value={editing.institution}
              placeholder="Université Felix Houphouët-Boigny..."
              onChange={(e) => set("institution", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Année</label>
            <input
              className="form-input"
              value={editing.year}
              placeholder="2026"
              onChange={(e) => set("year", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={editing.description}
              placeholder="Description optionnelle..."
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
