import request from "../fetch";

export const addLabel = async (label: { name: string; number: number }) =>
  request.post("/api/label/add", { name: label.name });
