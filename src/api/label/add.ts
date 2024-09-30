import request from "../fetch";

export const addLabel = async (name: string) =>
  request.post("/api/label/add", { name });
