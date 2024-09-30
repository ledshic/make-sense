import request from "../fetch";

export const register = async (username: string, password: string) =>
  request.post("/api/user/register", { username, password });
