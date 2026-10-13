import { useEffect, useState } from "react";

/** Renvoie l'id de la section qui occupe la bande haute de l'écran. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join(",");

  useEffect(() => {
    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting);
        const first = key.split(",").find((id) => visible.get(id));
        if (first) setActive(first);
      },
      // Une fine bande à ~30 % du haut de l'écran
      { rootMargin: "-30% 0px -69% 0px" },
    );
    for (const id of key.split(",")) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [key]);

  return active;
}
