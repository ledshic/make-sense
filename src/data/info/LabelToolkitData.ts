import { LabelType } from "../enums/LabelType";
import { ProjectType } from "../enums/ProjectType";

export interface ILabelToolkit {
  labelType: LabelType;
  headerText: string;
  imageSrc: string;
  imageAlt: string;
  projectType: ProjectType;
}

export const LabelToolkitData: ILabelToolkit[] = [
  {
    labelType: LabelType.IMAGE_RECOGNITION,
    headerText: "图片识别",
    imageSrc: "ico/object.png",
    imageAlt: "object",
    projectType: ProjectType.IMAGE_RECOGNITION,
  },
  {
    labelType: LabelType.RECT,
    headerText: "矩形",
    imageSrc: "ico/rectangle.png",
    imageAlt: "rectangle",
    projectType: ProjectType.OBJECT_DETECTION,
  },
  {
    labelType: LabelType.POINT,
    headerText: "点（暂不可用）",
    imageSrc: "ico/point.png",
    imageAlt: "point",
    projectType: ProjectType.OBJECT_DETECTION,
  },
  {
    labelType: LabelType.LINE,
    headerText: "线（暂不可用）",
    imageSrc: "ico/line.png",
    imageAlt: "line",
    projectType: ProjectType.OBJECT_DETECTION,
  },
  {
    labelType: LabelType.POLYGON,
    headerText: "多边形（暂不可用）",
    imageSrc: "ico/polygon.png",
    imageAlt: "polygon",
    projectType: ProjectType.OBJECT_DETECTION,
  },
];
