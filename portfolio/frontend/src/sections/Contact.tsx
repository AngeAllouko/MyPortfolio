import { Mail, MapPin, Phone, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
import api from "../api/axios";
import { GitHubIcon, LinkedInIcon } from "../components/BrandIcons";
import BlobScene from "../components/bg/BlobScene";
import SectionTitle from "../components/SectionTitle";
import Float3D from "../components/three-d/Float3D";
import { Keycap } from "../components/three-d/Objects3D";
import { usePortfolio } from "../data/context";
import { PALETTE } from "../lib/palette";
import "./Contact.css";

type Status = "idle" | "loading" | "success" | "error";
type Field = "name" | "email" | "subject" | "message";
type Errors = Partial<Record<Field, string>>;

const isDemo = import.meta.env.MODE === "demo" || import.meta.env.VITE_DEMO === "true";
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function validate(form: Record<Field, string>): Errors {
  const errors: Errors = {};
  if (!form.name.trim()) errors.name = "Indiquez votre nom.";
  if (!form.email.trim()) errors.email = "Indiquez votre adresse e-mail.";
  else if (!emailOk(form.email)) errors.email = "Cette adresse e-mail n'est pas valide.";
  if (!form.message.trim()) errors.message = "Écrivez votre message.";
  return errors;
}

export default function Contact() {
  const { profile } = usePortfolio();
  const [form, setForm] = useState<Record<Field, string>>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as Field;
    setForm((f) => ({ ...f, [name]: e.target.value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`contact-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setStatus("loading");
    try {
      if (isDemo) await new Promise((r) => setTimeout(r, 900));
      else
        await api.post("/contacts", {
          ...form,
          subject: form.subject.trim() || "Message depuis le portfolio",
        });
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const fieldProps = (name: Field) => ({
    id: `contact-${name}`,
    name,
    value: form[name],
    onChange: update,
    placeholder: " ",
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
  });

  const errorFor = (name: Field) =>
    errors[name] && (
      <p className="field-error" id={`contact-${name}-error`}>
        {errors[name]}
      </p>
    );

  return (
    <section id="contact" className="section contact has-bg">
      <BlobScene
        blobs={[
          { corner: "bottom-left", radius: 320, color: "#e8c400", fade: PALETTE.yellow, seed: 52 },
          { corner: "top-right", radius: 200, color: "#f2d000", fade: PALETTE.yellow, steps: 2, seed: 58 },
        ]}
      />
      <div className="container">
        <div className="contact-grid">
          <div className="contact-left">
            <SectionTitle className="contact-title" color="var(--on-yellow)">
              Travaillons ensemble
            </SectionTitle>
            <p className="contact-lead">
              Vous avez un projet en tête ? Écrivez-moi quelques lignes : je vous réponds dès que
              possible.
            </p>

            <ul className="contact-info">
              {profile?.email && (
                <li>
                  <Mail size={18} aria-hidden="true" />
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </li>
              )}
              {profile?.phone && (
                <li>
                  <Phone size={18} aria-hidden="true" />
                  <a href={`tel:${profile.phone.replace(/\s/g, "")}`}>{profile.phone}</a>
                </li>
              )}
              {profile?.location && (
                <li>
                  <MapPin size={18} aria-hidden="true" />
                  <span>{profile.location}</span>
                </li>
              )}
            </ul>

            <Float3D className="contact-key" depth={0.6}>
              <Keycap label="Entrée ↵" wide tone="light" />
            </Float3D>
          </div>

          <div className="contact-form-wrap">
            <AnimatePresence mode="wait" initial={false}>
              {status === "success" ? (
                <motion.div
                  key="success"
                  className="form-success"
                  role="status"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <svg viewBox="0 0 52 52" className="success-mark" aria-hidden="true">
                    <motion.circle
                      cx="26"
                      cy="26"
                      r="24"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.7, ease: "easeInOut" }}
                    />
                    <motion.path
                      d="M15 27l7 7 15-16"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.5, duration: 0.45, ease: "easeOut" }}
                    />
                  </svg>
                  <p className="form-success-title">Message envoyé.</p>
                  <p>Merci ! Je vous réponds très vite.</p>
                  <button className="btn btn-ghost btn-small" onClick={() => setStatus("idle")}>
                    Écrire un autre message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  className="contact-form"
                  onSubmit={submit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="form-row">
                    <div className="field">
                      <input type="text" autoComplete="name" {...fieldProps("name")} />
                      <label htmlFor="contact-name">Votre nom</label>
                      {errorFor("name")}
                    </div>
                    <div className="field">
                      <input type="email" autoComplete="email" {...fieldProps("email")} />
                      <label htmlFor="contact-email">Adresse e-mail</label>
                      {errorFor("email")}
                    </div>
                  </div>
                  <div className="field">
                    <input type="text" {...fieldProps("subject")} />
                    <label htmlFor="contact-subject">Objet (facultatif)</label>
                  </div>
                  <div className="field">
                    <textarea rows={5} {...fieldProps("message")} />
                    <label htmlFor="contact-message">Votre message</label>
                    {errorFor("message")}
                  </div>

                  {status === "error" && (
                    <p className="form-error" role="alert">
                      Le message n'a pas pu être envoyé. Vérifiez votre connexion, puis réessayez.
                    </p>
                  )}

                  <button className="btn btn-dark" type="submit" disabled={status === "loading"}>
                    {status === "loading" ? (
                      "Envoi en cours…"
                    ) : (
                      <>
                        <span className="btn-roll">
                          <span>Envoyer le message</span>
                          <span aria-hidden="true">Envoyer le message</span>
                        </span>
                        <Send size={16} aria-hidden="true" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        <footer className="site-footer">
          <p>
            © {new Date().getFullYear()} {profile?.name ?? "Portfolio"}
          </p>
          <div className="footer-links">
            {profile?.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noreferrer">
                <LinkedInIcon size={16} />
                LinkedIn
              </a>
            )}
            {profile?.github_url && (
              <a href={profile.github_url} target="_blank" rel="noreferrer">
                <GitHubIcon size={16} />
                GitHub
              </a>
            )}
          </div>
        </footer>
      </div>
    </section>
  );
}
