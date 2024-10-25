import request from "../../fetch";

export const upload = async (imageId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return request.upload(`/api/image/label/upload?imageId=${imageId}`, formData);
};
