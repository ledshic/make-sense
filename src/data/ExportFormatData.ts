import { ILabelFormatData } from "../interfaces/ILabelFormatData";
import { LabelType } from "./enums/LabelType";
import { AnnotationFormatType } from "./enums/AnnotationFormatType";

export type ExportFormatDataMap = Record<LabelType, ILabelFormatData[]>;

export const ExportFormatData: ExportFormatDataMap = {
  [LabelType.RECT]: [
    {
      type: AnnotationFormatType.YOLO,
      label: "YOLO 格式的单个压缩文件",
    },
    {
      type: AnnotationFormatType.VOC,
      label: "VOC XML 格式的单个压缩文件",
    },
    {
      type: AnnotationFormatType.CSV,
      label: "单个 CSV 文件",
    },
  ],
  [LabelType.POINT]: [
    {
      type: AnnotationFormatType.CSV,
      label: "单个 CSV 文件",
    },
  ],
  [LabelType.LINE]: [
    {
      type: AnnotationFormatType.CSV,
      label: "单个 CSV 文件",
    },
  ],
  [LabelType.POLYGON]: [
    {
      type: AnnotationFormatType.VGG,
      label: "VGG 格式的单文件",
    },
    {
      type: AnnotationFormatType.COCO,
      label: "COCO 格式的单文件",
    },
  ],
  [LabelType.IMAGE_RECOGNITION]: [
    {
      type: AnnotationFormatType.CSV,
      label: "单个 CSV 文件",
    },
    {
      type: AnnotationFormatType.JSON,
      label: "单个 JSON 文件",
    },
  ],
};
