import request from "../fetch";

export const login = async (account: string, password: string) =>
  request.post("/api/user/login", { account, password });
