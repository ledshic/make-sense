import request from "../fetch";

export const toBeIdentified = async (number: number) =>
  request.get("/api/image/to_be_identifier", { number });
