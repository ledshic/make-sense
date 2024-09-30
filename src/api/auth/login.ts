import request from "../fetch";

export const login = async (account: string, password: string) =>
  request.post(`/api/auth/login`, { account, password }, null, {
    hasTokenInHeaders: false,
  });
