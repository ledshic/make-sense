import React from "react";
import "./LoadMoreImagesPopup.scss";
import { connect, useDispatch } from "react-redux";
import { addImageData } from "../../../store/labels/actionCreators";
import { GenericYesNoPopup } from "../GenericYesNoPopup/GenericYesNoPopup";
import { useDropzone } from "react-dropzone";
import { ImageData } from "../../../store/labels/types";
import { PopupActions } from "../../../logic/actions/PopupActions";
import { ImageDataUtil } from "../../../utils/ImageDataUtil";
import { uploadUnidentifiedPics } from "src/api/image/upload";
import { submitNewNotification } from "src/store/notifications/actionCreators";
import { NotificationUtil } from "src/utils/NotificationUtil";
import useUnidentifiedImages from "src/hooks/images";

interface IProps {
  addImages: (imageData: ImageData[]) => void;
}

const LoadMoreImagesPopup: React.FC<IProps> = ({ addImages }) => {
  const dispatch = useDispatch();
  const { refreshImages } = useUnidentifiedImages({
    current: 0,
    pageSize: 20,
    initialLoad: false,
  });
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png"],
    },
  });

  const onAccept = () => {
    if (acceptedFiles.length > 0) {
      for (const file of acceptedFiles) {
        console.log("uploading file", file);
        uploadUnidentifiedPics(file)
          .then(res => {
            console.log("upload pic success", res);

            refreshImages();

            dispatch(
              submitNewNotification(
                NotificationUtil.createMessageNotification({
                  header: "Success",
                  description: `File ${file.name} uploaded successfully`,
                })
              )
            );
          })
          .catch(err => {
            console.log("upload pic error", err);
          });
      }

      addImages(
        acceptedFiles.map((fileData: File) =>
          ImageDataUtil.createImageDataFromFileData(fileData)
        )
      );
      PopupActions.close();
    }
  };

  const onReject = () => {
    PopupActions.close();
  };

  const getDropZoneContent = () => {
    if (acceptedFiles.length === 0)
      return (
        <>
          <input {...getInputProps()} />
          <img draggable={false} alt={"upload"} src={"ico/box-opened.png"} />
          <p className="extraBold">将图片直接拖进来</p>
          <p>或</p>
          <p className="extraBold">点击这里使用文件浏览器</p>
        </>
      );
    else if (acceptedFiles.length === 1)
      return (
        <>
          <img draggable={false} alt={"uploaded"} src={"ico/box-closed.png"} />
          <p className="extraBold">已加载一张图片</p>
        </>
      );
    else
      return (
        <>
          <img
            draggable={false}
            key={1}
            alt={"uploaded"}
            src={"ico/box-closed.png"}
          />
          <p key={2} className="extraBold">
            已加载 {acceptedFiles.length} 张图片
          </p>
        </>
      );
  };

  const renderContent = () => {
    return (
      <div className="LoadMoreImagesPopupContent">
        <div {...getRootProps({ className: "DropZone" })}>
          {getDropZoneContent()}
        </div>
      </div>
    );
  };

  return (
    <GenericYesNoPopup
      title={"上传更多图片"}
      renderContent={renderContent}
      acceptLabel={"上传"}
      disableAcceptButton={acceptedFiles.length < 1}
      onAccept={onAccept}
      rejectLabel={"取消"}
      onReject={onReject}
    />
  );
};

const mapDispatchToProps = {
  addImages: addImageData,
};

const mapStateToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoadMoreImagesPopup);
