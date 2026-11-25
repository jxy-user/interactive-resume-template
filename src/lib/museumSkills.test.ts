import { describe, expect, it } from 'vitest';
import { getSkillName } from './museumSkills';

describe('getSkillName', () => {
  it('keeps plain string skills unchanged', () => {
    expect(getSkillName('React')).toBe('React');
  });

  it('extracts the name from skill objects', () => {
    expect(getSkillName({ name: 'TypeScript', level: 90 })).toBe('TypeScript');
  });
});
