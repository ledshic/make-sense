import request from "../fetch";
import qs from "qs";

export const register = async (account: string, password: string) =>
  request.post(
    `/api/user/register?${qs.stringify({ account, password })}`,
    null,
    null,
    { hasTokenInHeaders: false }
  );
