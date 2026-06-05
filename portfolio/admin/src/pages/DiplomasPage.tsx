import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Award } from "lucide-react";
import api from "../api/axios";
import Modal from "../components/Modal";
import Toast from "../components/Toast";

interface Diploma {
  id?: number;
  degree: string;
  school: string;
  field: string;
  start_year: number;
  end_year: number | "";
  description: string;
}
const empty: Diploma = {
  degree: "",
  school: "",
  field: "",
  start_year: new Date().getFullYear(),
  end_year: "",
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

  const set = (k: keyof Diploma, v: string | number) =>
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
          <p>Aucun diplôme. Commence par en ajouter un !</p>
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
                  <p className="item-title">
                    {d.degree}{" "}
                    <span
                      style={{
                        color: "var(--text-secondary)",
                        fontWeight: 400,
                      }}
                    >
                      — {d.field}
                    </span>
                  </p>
                  <p className="item-subtitle">{d.school}</p>
                  <p className="item-meta">
                    {d.start_year} — {d.end_year || "Présent"}
                  </p>
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
            <label className="form-label">Diplôme</label>
            <input
              className="form-input"
              value={editing.degree}
              placeholder="Master, Licence..."
              onChange={(e) => set("degree", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Établissement</label>
            <input
              className="form-input"
              value={editing.school}
              placeholder="Université de..."
              onChange={(e) => set("school", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Domaine</label>
            <input
              className="form-input"
              value={editing.field}
              placeholder="Informatique, Design..."
              onChange={(e) => set("field", e.target.value)}
            />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Année début</label>
              <input
                className="form-input"
                type="number"
                value={editing.start_year}
                onChange={(e) => set("start_year", Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Année fin</label>
              <input
                className="form-input"
                type="number"
                value={editing.end_year}
                placeholder="Vide = Présent"
                onChange={(e) =>
                  set("end_year", e.target.value ? Number(e.target.value) : "")
                }
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={editing.description}
              placeholder="Optionnelle..."
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
