import { createContext, useContext } from "react";
import type { Diploma, Experience, Profile, Project, Skill } from "../types";

export type LoadStatus = "loading" | "ready" | "error";

export interface PortfolioData {
  status: LoadStatus;
  profile: Profile | null;
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  diplomas: Diploma[];
  /** Compétences regroupées par catégorie, dans l'ordre d'apparition */
  skillGroups: [string, Skill[]][];
}

export const emptyData: PortfolioData = {
  status: "loading",
  profile: null,
  skills: [],
  projects: [],
  experiences: [],
  diplomas: [],
  skillGroups: [],
};

export const PortfolioContext = createContext<PortfolioData>(emptyData);

export const usePortfolio = () => useContext(PortfolioContext);
