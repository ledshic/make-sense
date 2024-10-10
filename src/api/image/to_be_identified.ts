import request from "../fetch";

interface IToBeIdentified {
  pageNumber: number;
  pageSize: number;
}

export const toBeIdentified = async ({
  pageNumber,
  pageSize,
}: IToBeIdentified): Promise<any> =>
  request.get("/api/image/to_be_identifier", { pageNumber, pageSize });
