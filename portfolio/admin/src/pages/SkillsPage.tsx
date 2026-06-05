import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import api from "../api/axios";
import Modal from "../components/Modal";
import Toast from "../components/Toast";

interface Skill {
  id?: number;
  name: string;
  category: string;
  level: number;
}
const empty: Skill = { name: "", category: "", level: 80 };

const catColors: Record<number, { color: string; bg: string }> = {
  0: { color: "var(--purple)", bg: "var(--purple-dim)" },
  1: { color: "var(--blue)", bg: "var(--blue-dim)" },
  2: { color: "var(--green)", bg: "var(--green-dim)" },
  3: { color: "var(--yellow)", bg: "var(--yellow-dim)" },
  4: { color: "var(--pink)", bg: "var(--pink-dim)" },
};

export default function SkillsPage() {
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Skill>(empty);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const load = () =>
    api
      .get("/skills")
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      editing.id
        ? await api.put(`/skills/${editing.id}`, editing)
        : await api.post("/skills", editing);
      setModal(false);
      load();
      setToast({ msg: "Compétence sauvegardée ✓", type: "success" });
    } catch {
      setToast({ msg: "Erreur", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ?")) return;
    try {
      await api.delete(`/skills/${id}`);
      load();
      setToast({ msg: "Supprimé ✓", type: "success" });
    } catch {
      setToast({ msg: "Erreur", type: "error" });
    }
  };

  const set = (k: keyof Skill, v: string | number) =>
    setEditing((e) => ({ ...e, [k]: v }));

  const grouped = items.reduce<Record<string, Skill[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

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
          <h1 className="page-title">Gestion des Compétences</h1>
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
            <Star size={40} />
          </div>
          <p>Aucune compétence. Ajoutes-en une !</p>
        </div>
      ) : (
        <div className="card">
          {Object.entries(grouped).map(([cat, skills], ci) => {
            const { color, bg } = catColors[ci % 5];
            return (
              <div className="category-group" key={cat}>
                <span className="category-label" style={{ color }}>
                  {cat}
                </span>
                {skills.map((s) => (
                  <div className="skill-item" key={s.id}>
                    <div className="item-icon" style={{ background: bg }}>
                      <Star size={15} color={color} />
                    </div>
                    <div className="skill-bar-wrap">
                      <div className="skill-bar-top">
                        <span className="skill-bar-label">{s.name}</span>
                        <span className="skill-bar-pct">{s.level}%</span>
                      </div>
                      <div className="skill-bar-track">
                        <div
                          className="skill-bar-fill"
                          style={{ width: `${s.level}%`, background: color }}
                        />
                      </div>
                    </div>
                    <div className="item-actions">
                      <button
                        className="btn-icon"
                        onClick={() => {
                          setEditing(s);
                          setModal(true);
                        }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="btn-icon danger"
                        onClick={() => handleDelete(s.id!)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <Modal
          title={editing.id ? "Modifier" : "Nouvelle compétence"}
          onClose={() => setModal(false)}
        >
          <div className="form-group">
            <label className="form-label">Nom</label>
            <input
              className="form-input"
              value={editing.name}
              placeholder="React, Figma..."
              onChange={(e) => set("name", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Catégorie</label>
            <input
              className="form-input"
              value={editing.category}
              placeholder="Frontend Tech, Design Tools..."
              onChange={(e) => set("category", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Niveau : {editing.level}%</label>
            <input
              type="range"
              className="form-range"
              min={0}
              max={100}
              value={editing.level}
              onChange={(e) => set("level", Number(e.target.value))}
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
