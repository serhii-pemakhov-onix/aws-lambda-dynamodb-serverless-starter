type ObjectValues<T extends Record<string, string>> = T[keyof T];

export default ObjectValues;
