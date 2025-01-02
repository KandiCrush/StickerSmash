declare module 'dom-to-image' {
  export function toJpeg(node: View, options?: { quality?: number, width?: number, height?: number }): Promise<string>;
  // Ajoutez d'autres fonctions exportées par le module si nécessaire
} 