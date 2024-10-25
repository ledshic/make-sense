import request from "../fetch";

interface LabelData {
  labelId: string;
  name: string;
  number: number;
}

export const fetchLabelList = async () =>
  request.get<LabelData[]>("/api/label/list");
