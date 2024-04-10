export const kB = (value: number) => value * (2 ** 10);
export const mB = (value: number) => kB(value) * (2 ** 10);

const fileLimitsByFormat = [
  { regexp: /image\/(\w+)/, maxSize: mB(10) },
  { regexp: /application\/(.+)\.docx/, maxSize: mB(10) },
  { regexp: /application\/(.+)\.doc/, maxSize: mB(10) },
  { regexp: /application\/(.+)\.pptx/, maxSize: mB(10) },
  { regexp: /application\/(.+)\.ppt/, maxSize: mB(10) },
  { regexp: /application\/(.+)\.xlsx/, maxSize: mB(10) },
  { regexp: /application\/(.+)\.xls/, maxSize: mB(10) },
  { regexp: /application\/pdf/, maxSize: mB(10) },
  { regexp: /video\/(\w+)/, maxSize: mB(100) },
];

export const getFileSizeLimit = (fileType: string): number => {
  const { maxSize } = fileLimitsByFormat.find(({ regexp }) => regexp.exec(fileType)) || {};

  return maxSize || 0;
};
