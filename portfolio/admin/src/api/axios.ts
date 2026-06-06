
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: { "Accept": "application/json" },
});

// URL de base du backend pour les fichiers stockés
export const storageUrl = (path: string | null | undefined): string => {
  if (!path) return "";
  // Déjà une URL complète (http/https) → on la retourne telle quelle
  if (path.startsWith("http")) return path;
  // Chemin relatif /storage/... → on préfixe avec l'URL du backend
  const base = import.meta.env.VITE_STORAGE_URL || "http://localhost:8000";
  return `${base}${path}`;
};

export default api;