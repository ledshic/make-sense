import request from "../fetch";

export const listForDelete = async () => request.get("/api/user/listForDelete");
