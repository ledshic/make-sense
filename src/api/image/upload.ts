import request from "../fetch";

export const uploadUnidentifiedPics = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return request.upload("/api/image/upload", formData);
};
