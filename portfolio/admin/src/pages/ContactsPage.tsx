import { useEffect, useState } from "react";
import { Trash2, MessageSquare, Mail, Clock, ChevronDown } from "lucide-react";
import api from "../api/axios";
import Toast from "../components/Toast";

// ✅ Aligné sur la BD : subject inclus
interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function ContactsPage() {
  const [items, setItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const load = () =>
    api
      .get("/contacts")
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce message ?")) return;
    try {
      await api.delete(`/contacts/${id}`);
      load();
      setToast({ msg: "Message supprimé ✓", type: "success" });
    } catch {
      setToast({ msg: "Erreur", type: "error" });
    }
  };

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
          <h1 className="page-title">Messages de Contact</h1>
        </div>
        <span
          style={{
            fontSize: "0.82rem",
            color: "var(--text-muted)",
            padding: "8px 14px",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          {items.length} message{items.length !== 1 ? "s" : ""}
        </span>
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
            <MessageSquare size={40} />
          </div>
          <p>Aucun message reçu.</p>
        </div>
      ) : (
        <div className="card list">
          {items.map((c) => (
            <div key={c.id} style={{ borderBottom: "1px solid var(--border)" }}>
              {/* Header */}
              <div
                className="contact-header"
                onClick={() => setExpanded(expanded === c.id ? null : c.id)}
              >
                <div
                  className="item-icon"
                  style={{ background: "var(--pink-dim)", flexShrink: 0 }}
                >
                  <MessageSquare size={16} color="var(--pink)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <p className="item-title" style={{ marginBottom: 0 }}>
                      {c.name}
                    </p>
                    {!c.is_read && (
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "var(--accent)",
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 2,
                    }}
                  >
                    <Mail size={12} color="var(--text-muted)" />
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {c.email}
                    </span>
                  </div>
                  {/* Sujet visible en aperçu */}
                  {expanded !== c.id && c.subject && (
                    <p
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--text-muted)",
                        marginTop: 3,
                      }}
                    >
                      <strong style={{ color: "var(--text-secondary)" }}>
                        Sujet :
                      </strong>{" "}
                      {c.subject}
                    </p>
                  )}
                  {expanded !== c.id && (
                    <p className="item-desc" style={{ marginTop: 3 }}>
                      {c.message}
                    </p>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexShrink: 0,
                  }}
                >
                  <button
                    className="btn-icon danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(c.id);
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                  <ChevronDown
                    size={16}
                    className={`contact-chevron${expanded === c.id ? " open" : ""}`}
                  />
                </div>
              </div>

              {/* Corps expandable */}
              {expanded === c.id && (
                <div className="contact-body">
                  {c.subject && (
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)",
                        marginBottom: 10,
                      }}
                    >
                      <strong>Objet :</strong> {c.subject}
                    </p>
                  )}
                  <div className="contact-message-box">{c.message}</div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      <Clock size={12} />
                      <span>{fmt(c.created_at)}</span>
                    </div>
                    <a
                      className="contact-reply-link"
                      href={`mailto:${c.email}?subject=Re: ${c.subject}`}
                    >
                      <Mail size={13} /> Répondre à {c.email}
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
