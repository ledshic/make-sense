import request from "../fetch";

export const list = async () => request.get("/api/user/list");
