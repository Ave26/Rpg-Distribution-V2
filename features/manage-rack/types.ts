export type SlugType = "bin" | "damage-bin";

export function isValidSlug(value: string): value is SlugType {
  return ["bin", "damage-bin"].includes(value as SlugType);
}
