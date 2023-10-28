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

export type LectureCategoryFilterNames = 'ALL' | LectureCategoryNames
export const LectureCategoryFilter: ReadonlyRecord<LectureCategoryFilterNames, LectureCategoryFilterNames> = {
  ALL: 'ALL',
  WEB: 'WEB',
  APP: 'APP',
  GAME: 'GAME',
  ALGORITHM: 'ALGORITHM',
  INFRA: 'INFRA',
  DATABASE: 'DATABASE',
};

export type LectureSearchTypeNames = 'TITLE' | 'INSTRUCTOR' | 'STUDENT_ID'
export const LectureSearchType: ReadonlyRecord<LectureSearchTypeNames, LectureSearchTypeNames> = {
  TITLE: 'TITLE',
  INSTRUCTOR: 'INSTRUCTOR',
  STUDENT_ID: 'STUDENT_ID',
};

export type LectureOrderTypeNames = 'RECENT' | 'ENROLLMENTS'
export const LectureOrderType: ReadonlyRecord<LectureOrderTypeNames, LectureOrderTypeNames> = {
  RECENT: 'RECENT',
  ENROLLMENTS: 'ENROLLMENTS',
};
