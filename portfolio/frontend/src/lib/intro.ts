import { createContext, useContext } from "react";

/** Vrai une fois le préchargeur terminé : les animations d'entrée peuvent démarrer. */
export const IntroContext = createContext(true);

export const useIntroDone = () => useContext(IntroContext);
