import { env } from '../instances/env';

const { invalidWords } = env.content;

export const purgeName = (name = ''): string => {
  const plainName = removeExtension(name);

  const purgedName = invalidWords.reduce(
    (prev, current) => prev.replace(new RegExp(current, 'gi'), ''),
    plainName,
  );

  return purgedName
    .replaceAll('_', ' ')
    .replaceAll('-', ' ')
    .replaceAll('.', ' ')
    .replaceAll('  ', ' ');
};

const removeExtension = (name: string): string => name.replace(/\.[^/.]+$/, '');
