export const pick = <T extends Record<string, any>>(
  obj: T,
  keys: (keyof T)[]
): Partial<T> => {
  const finalObject: Partial<T> = {};
  for (const key of keys) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
      finalObject[key] = obj[key];
    }
  }

  return finalObject;
};
