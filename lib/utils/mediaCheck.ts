const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/jpg"];
const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];

export const isImage = ({ file, format = "" }: {file?: File, format?: string}) => {
  if (!file && !format) return false;

  if (file) return validImageTypes.includes(file.type);

  return validImageTypes.map(type => type.split("/")[1]).includes(format?.split(".").pop() ?? "");
};

export const isVideo = ({ file, format = "" }: {file?: File, format?: string}) => {
  if (!file && !format) return false;

  if (file) return validVideoTypes.includes(file.type);

  return validVideoTypes.map(type => type.split("/")[1]).includes(format?.split(".").pop() ?? "");
};

export const isMedia = ({ file, format = "" }: {file?: File, format?: string}) => isImage({
  file,
  format
}) || isVideo({
  file,
  format
});