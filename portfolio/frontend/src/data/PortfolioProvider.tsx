import { useEffect, useMemo, useState, type ReactNode } from "react";
import api from "../api/axios";
import type { Diploma, Experience, Profile, Project, Skill } from "../types";
import { PortfolioContext, emptyData, type PortfolioData } from "./context";

const isDemo = import.meta.env.MODE === "demo" || import.meta.env.VITE_DEMO === "true";

/** L'API peut renvoyer un objet, un tableau, ou { data: [...] } (ressources Laravel). */
function unwrap<T>(raw: unknown): T {
  if (raw && typeof raw === "object" && !Array.isArray(raw) && "data" in raw) {
    return (raw as { data: T }).data;
  }
  return raw as T;
}

function asList<T>(raw: unknown): T[] {
  const v = unwrap<unknown>(raw);
  return Array.isArray(v) ? (v as T[]) : [];
}

/**
 * Laravel renvoie `null` pour les champs vides. On les transforme en
 * `undefined` pour que les valeurs par défaut et les `?.` du code s'appliquent.
 */
function dropNulls<T>(item: unknown): T {
  if (!item || typeof item !== "object") return {} as T;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(item as Record<string, unknown>)) {
    if (v !== null) out[k] = v;
  }
  return out as T;
}

const str = (v: unknown) => (v === undefined || v === null ? "" : String(v));

/** technologies peut arriver en tableau, en JSON ou en texte "a, b, c". */
function normalizeTech(t: unknown): string[] {
  if (Array.isArray(t)) return t.map(String).filter(Boolean);
  if (typeof t === "string" && t.trim()) {
    try {
      const parsed = JSON.parse(t);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      /* texte simple */
    }
    return t.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

export default function PortfolioProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Omit<PortfolioData, "skillGroups">>(emptyData);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (isDemo) {
        const demo = await import("./demo");
        if (cancelled) return;
        setState({
          status: "ready",
          profile: demo.demoProfile,
          skills: demo.demoSkills,
          projects: demo.demoProjects,
          experiences: demo.demoExperiences,
          diplomas: demo.demoDiplomas,
        });
        return;
      }

      // Une seule requête par ressource pour tout le site
      const [p, s, pr, e, d] = await Promise.allSettled([
        api.get("/profile"),
        api.get("/skills"),
        api.get("/projects"),
        api.get("/experiences"),
        api.get("/diplomas"),
      ]);
      if (cancelled) return;

      const val = (r: PromiseSettledResult<{ data: unknown }>) =>
        r.status === "fulfilled" ? r.value.data : undefined;

      const rawProfile = unwrap<unknown>(val(p));
      const first = Array.isArray(rawProfile) ? rawProfile[0] : rawProfile;
      const profile = first ? dropNulls<Profile>(first) : null;
      if (profile) {
        profile.name = str(profile.name);
        profile.title = str(profile.title);
      }

      const skills = asList<unknown>(val(s)).map((raw) => {
        const sk = dropNulls<Skill>(raw);
        return { ...sk, name: str(sk.name), category: str(sk.category), level: Number(sk.level) || 0 };
      });

      const projects = asList<unknown>(val(pr)).map((raw) => {
        const proj = dropNulls<Project>(raw);
        return {
          ...proj,
          title: str(proj.title) || "Projet sans titre",
          description: str(proj.description),
          technologies: normalizeTech(proj.technologies),
          featured: Boolean(Number(proj.featured)) || proj.featured === true,
        };
      });

      const experiences = asList<unknown>(val(e)).map((raw) => {
        const ex = dropNulls<Experience>(raw);
        return { ...ex, job_title: str(ex.job_title), company: str(ex.company), start_date: str(ex.start_date), description: str(ex.description) };
      });

      const diplomas = asList<unknown>(val(d)).map((raw) => {
        const dp = dropNulls<Diploma>(raw);
        return { ...dp, title: str(dp.title), institution: str(dp.institution), year: str(dp.year) };
      });

      setState({
        status: [p, s, pr, e, d].every((r) => r.status === "rejected") ? "error" : "ready",
        profile,
        skills,
        projects,
        experiences,
        diplomas,
      });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<PortfolioData>(() => {
    const groups = new Map<string, Skill[]>();
    for (const s of state.skills) {
      const key = s.category || "Autres";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(s);
    }
    return { ...state, skillGroups: [...groups.entries()] };
  }, [state]);

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}
