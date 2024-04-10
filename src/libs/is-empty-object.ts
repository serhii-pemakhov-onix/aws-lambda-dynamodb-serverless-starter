export const isEmptyObject = (obj: Record<string, any>): boolean => !Object.keys(obj).length;

export const isEmpty = (value: unknown): value is null | undefined | '' | {} => (
  value === undefined
  || value === null
  || value === ''
  || (typeof value === 'object' && isEmptyObject(value))
);
