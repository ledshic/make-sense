import request from "../fetch";

export const fetchOriginalImageFile = async (fileId: string) => {
  return request.file(`/api/image/download?fileId=${fileId}`);
};
