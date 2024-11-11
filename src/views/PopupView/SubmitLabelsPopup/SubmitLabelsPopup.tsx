import React, { useState } from "react";
import { connect } from "react-redux";

import { AnnotationFormatType } from "../../../data/enums/AnnotationFormatType";
import { LabelType } from "../../../data/enums/LabelType";
import { ILabelFormatData } from "../../../interfaces/ILabelFormatData";
import { PopupActions } from "../../../logic/actions/PopupActions";
import GenericLabelTypePopup from "../GenericLabelTypePopup/GenericLabelTypePopup";
import { ExportFormatData } from "../../../data/ExportFormatData";
import { AppState } from "../../../store";

import { LabelsSelector } from "src/store/selectors/LabelsSelector";
import type { ImageData } from "src/store/labels/types";
import { RectLabelsExporter } from "src/logic/export/RectLabelsExporter";
import { upload } from "src/api/image/label/upload";
import useUnidentifiedImages from "src/hooks/images";

import "./SubmitLabelsPopup.scss";

interface IProps {
  activeLabelType: LabelType;
}

const ExportLabelPopup: React.FC<IProps> = ({ activeLabelType }) => {
  const [labelType, setLabelType] = useState(activeLabelType);
  const [exportFormatType, setExportFormatType] = useState(null);

  const { refreshImages } = useUnidentifiedImages({
    current: 0,
    pageSize: 20,
    initialLoad: false,
  });

  const onAccept = async () => {
    LabelsSelector.getImagesData().forEach((imageData: ImageData) => {
      const {
        raw_data: { imageId, name },
      } = imageData;
      const fileContent: string =
        RectLabelsExporter.wrapRectLabelsIntoYOLO(imageData);
      if (fileContent) {
        const fileName: string = name.replace(/\.[^/.]+$/, ".txt");

        const txtFile = new File([fileContent], fileName, {
          type: "text/plain",
          lastModified: Date.now(),
        });

        try {
          console.info("prepare to upload << txtFile << ", txtFile);
          console.info("relative image << imageData << ", imageData);
          upload(imageId, txtFile).then(res => {
            console.info("upload << res << ", res);
            refreshImages();
          });
        } catch (error) {
          console.warn("error", error);
        }
      }
    });
    PopupActions.close();
  };

  const onReject = () => {
    PopupActions.close();
  };

  const onSelect = (type: AnnotationFormatType) => {
    setExportFormatType(type);
  };

  const getOptions = (exportFormatData: ILabelFormatData[]) => {
    return exportFormatData.map((entry: ILabelFormatData) => {
      return (
        <div
          className="OptionsItem"
          onClick={() => onSelect(entry.type)}
          key={entry.type}
        >
          {entry.type === exportFormatType ? (
            <img
              draggable={false}
              src={"ico/checkbox-checked.png"}
              alt={"checked"}
            />
          ) : (
            <img
              draggable={false}
              src={"ico/checkbox-unchecked.png"}
              alt={"unchecked"}
            />
          )}
          {entry.label}
        </div>
      );
    });
  };

  const renderInternalContent = (type: LabelType) => {
    return (
      <>
        <div className="Message">选择要提交的标注格式</div>,
        <div className="Options">{getOptions(ExportFormatData[type])}</div>
      </>
    );
  };

  const onLabelTypeChange = (type: LabelType) => {
    setLabelType(type);
    setExportFormatType(null);
  };

  return (
    <GenericLabelTypePopup
      activeLabelType={labelType}
      title={`提交标注`}
      onLabelTypeChange={onLabelTypeChange}
      acceptLabel="提交"
      onAccept={onAccept}
      disableAcceptButton={!exportFormatType}
      rejectLabel="取消"
      onReject={onReject}
      renderInternalContent={renderInternalContent}
    />
  );
};

const mapDispatchToProps = {};

const mapStateToProps = (state: AppState) => ({
  activeLabelType: state.labels.activeLabelType,
});

export default connect(mapStateToProps, mapDispatchToProps)(ExportLabelPopup);
