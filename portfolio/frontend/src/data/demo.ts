// Données de démonstration — utilisées uniquement en mode "demo"
// (npm run dev:demo / npm run build:demo) pour prévisualiser le site sans backend.
import type { Diploma, Experience, Profile, Project, Skill } from "../types";

export const demoProfile: Profile = {
  name: "Aedan",
  title: "Développeur front-end & designer",
  bio: "Je conçois et je développe des sites web réactifs et des applications mobiles iOS. J'aime les interfaces qui vont droit au but, le code qui se relit sans effort et les animations qui expliquent ce qui vient de se passer.",
  email: "contact@exemple.com",
  location: "Disponible à distance",
  linkedin_url: "https://www.linkedin.com/",
  github_url: "https://github.com/",
};

export const demoSkills: Skill[] = [
  { id: 1, name: "React", category: "Développement web", level: 90 },
  { id: 2, name: "TypeScript", category: "Développement web", level: 85 },
  { id: 3, name: "Laravel", category: "Développement web", level: 75 },
  { id: 4, name: "CSS & animation", category: "Développement web", level: 88 },
  { id: 5, name: "Swift", category: "Applications mobiles", level: 70 },
  { id: 6, name: "SwiftUI", category: "Applications mobiles", level: 72 },
  { id: 7, name: "Flutter", category: "Applications mobiles", level: 65 },
  { id: 8, name: "Figma", category: "Design d'interface", level: 85 },
  { id: 9, name: "Prototypage", category: "Design d'interface", level: 80 },
  { id: 10, name: "Design system", category: "Design d'interface", level: 74 },
];

export const demoExperiences: Experience[] = [
  {
    id: 1,
    job_title: "Développeur front-end",
    company: "Studio indépendant",
    start_date: "2023-03-01",
    description: "Sites vitrines et applications web pour de petites entreprises.",
  },
  {
    id: 2,
    job_title: "Stagiaire développeur web",
    company: "Agence numérique",
    start_date: "2022-06-01",
    end_date: "2022-12-01",
    description: "Intégration de maquettes et développement de composants React.",
  },
];

export const demoDiplomas: Diploma[] = [
  { id: 1, title: "Licence en informatique", institution: "Université", year: "2024" },
  { id: 2, title: "Baccalauréat scientifique", institution: "Lycée", year: "2021" },
];

export const demoProjects: Project[] = [
  {
    id: 1,
    title: "Carnet de course",
    description:
      "Application mobile pour suivre ses sorties de course et ses objectifs de la semaine, avec des graphiques de progression.",
    technologies: ["SwiftUI", "Core Data", "Charts"],
    github_link: "https://github.com/",
    featured: true,
  },
  {
    id: 2,
    title: "Plateforme de tutorat",
    description:
      "Mise en relation d'élèves et de tuteurs : recherche par matière, réservation de créneaux et messagerie.",
    technologies: ["React", "Laravel", "MySQL"],
    live_link: "https://example.com/",
    github_link: "https://github.com/",
    featured: true,
  },
  {
    id: 3,
    title: "Tableau de bord personnel",
    description:
      "Une application de bureau et Android pour organiser ses finances, ses projets et sa santé au même endroit.",
    technologies: ["Flutter", "Supabase"],
    github_link: "https://github.com/",
    featured: false,
  },
];
