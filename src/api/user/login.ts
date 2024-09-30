import request from "../fetch";
import qs from "qs";

export const login = async (account: string, password: string) =>
  request.post(`/api/user/login?${qs.stringify({ account, password })}`, {});
