import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * Si une section plante (donnée inattendue de l'API, par exemple), on la
 * masque au lieu de laisser toute la page devenir vide. L'erreur reste
 * visible dans la console pour la corriger.
 */
export default class SectionBoundary extends Component<
  { name: string; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[Portfolio] La section « ${this.props.name} » n'a pas pu s'afficher :`, error, info.componentStack);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
