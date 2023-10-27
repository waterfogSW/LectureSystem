type ReadonlyRecord<K extends string, V> = Readonly<Record<K, V>>;
export type LectureCategoryNames = 'WEB' | 'APP' | 'GAME' | 'ALGORITHM' | 'INFRA' | 'DATABASE'
export const LectureCategory: ReadonlyRecord<LectureCategoryNames, LectureCategoryNames> = {
  WEB: 'WEB',
  APP: 'APP',
  GAME: 'GAME',
  ALGORITHM: 'ALGORITHM',
  INFRA: 'INFRA',
  DATABASE: 'DATABASE',
};
