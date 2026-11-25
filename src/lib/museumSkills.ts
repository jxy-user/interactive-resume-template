export type SkillLike = string | { name: string; level?: number };

export function getSkillName(item: SkillLike): string {
  return typeof item === 'string' ? item : item.name;
}
