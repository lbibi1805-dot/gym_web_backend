export const isFoundObject = (obj: unknown): boolean => {
  return obj !== null && obj !== undefined && typeof obj === 'object';
};

export const isEmptyObject = (obj: unknown): boolean => {
  return isFoundObject(obj) && Object.keys(obj as Record<string, unknown>).length === 0;
};

export const isNotEmpty = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value !== null && value !== undefined;
};
