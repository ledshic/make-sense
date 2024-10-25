import React from "react";
import { connect } from "react-redux";
import { LabelType } from "../../../../data/enums/LabelType";
import { ISize } from "../../../../interfaces/ISize";
import { AppState } from "../../../../store";
import {
  ImageData,
  LabelPoint,
  LabelRect,
} from "../../../../store/labels/types";
import { VirtualList } from "../../../Common/VirtualList/VirtualList";
import ImagePreview from "../ImagePreview/ImagePreview";
import "./ImagesList.scss";
import { ContextManager } from "../../../../logic/context/ContextManager";
import { ContextType } from "../../../../data/enums/ContextType";
import { ImageActions } from "../../../../logic/actions/ImageActions";
import { EventType } from "../../../../data/enums/EventType";
import { LabelStatus } from "../../../../data/enums/LabelStatus";
import { toBeIdentified } from "src/api/image/to_be_identified";
import { getToken } from "src/utils/storage/token";
import { get } from "lodash";
import { ImageDataUtil } from "src/utils/ImageDataUtil";
import { addImageData } from "src/store/labels/actionCreators";
import { fetchOriginalImageFile } from "src/api/image/download";
import { NotificationUtil } from "src/utils/NotificationUtil";

interface IProps {
  activeImageIndex: number;
  imagesData: ImageData[];
  activeLabelType: LabelType;
  addImageData: (imageData: ImageData[]) => void;
}

interface IState {
  size: ISize;
}

class ImagesList extends React.Component<IProps, IState> {
  private imagesListRef: HTMLDivElement;

  constructor(props) {
    super(props);

    this.state = {
      size: null,
    };
  }

  public componentDidMount(): void {
    this.updateListSize();
    window.addEventListener(EventType.RESIZE, this.updateListSize);

    const token = getToken();
    if (token) {
      toBeIdentified({ pageNumber: 0, pageSize: 20 })
        .then(res => {
          console.log("get pics success", res);
          const pics = get(res, "data.content", []);

          const imageDatas = pics.map(async pic => {
            const { imageId } = pic;
            const picFile = await fetchOriginalImageFile(imageId);

            console.log("picFile", picFile);
            const _blob = new Blob([picFile], { type: "image/jpeg" });
            const _file = new File([_blob], "image.jpg", {
              type: "image/jpeg",
            });

            return ImageDataUtil.createImageDataFromFileData(_file);
          });

          Promise.allSettled(imageDatas)
            .then(synced_imageDatas => {
              this.props.addImageData(
                synced_imageDatas.map((result, index) => {
                  if (result.status === "fulfilled") {
                    return result.value;
                  }
                  console.error("Failed to load image", result);
                  throw new Error(`Failed to load image, ${index}`);
                })
              );
            })
            .catch(err => {
              NotificationUtil.createErrorNotification({
                header: "Failed to load images",
                description: err.message,
              });
            });
        })
        .catch(err => {
          console.log("get pics error", err);
        });
    }
  }

  public componentWillUnmount(): void {
    window.removeEventListener(EventType.RESIZE, this.updateListSize);
  }

  private updateListSize = () => {
    if (!this.imagesListRef) return;

    const listBoundingBox = this.imagesListRef.getBoundingClientRect();
    this.setState({
      size: {
        width: listBoundingBox.width,
        height: listBoundingBox.height,
      },
    });
  };

  private isImageChecked = (index: number): boolean => {
    const imageData = this.props.imagesData[index];
    switch (this.props.activeLabelType) {
      case LabelType.LINE:
        return imageData.labelLines.length > 0;
      case LabelType.IMAGE_RECOGNITION:
        return imageData.labelNameIds.length > 0;
      case LabelType.POINT:
        return (
          imageData.labelPoints.filter(
            (labelPoint: LabelPoint) =>
              labelPoint.status === LabelStatus.ACCEPTED
          ).length > 0
        );
      case LabelType.POLYGON:
        return imageData.labelPolygons.length > 0;
      case LabelType.RECT:
        return (
          imageData.labelRects.filter(
            (labelRect: LabelRect) => labelRect.status === LabelStatus.ACCEPTED
          ).length > 0
        );
    }
  };

  private onClickHandler = (index: number) => {
    ImageActions.getImageByIndex(index);
  };

  private renderImagePreview = (
    index: number,
    isScrolling: boolean,
    isVisible: boolean,
    style: React.CSSProperties
  ) => {
    return (
      <ImagePreview
        key={index}
        style={style}
        size={{ width: 150, height: 150 }}
        isScrolling={isScrolling}
        isChecked={this.isImageChecked(index)}
        imageData={this.props.imagesData[index]}
        onClick={() => this.onClickHandler(index)}
        isSelected={this.props.activeImageIndex === index}
      />
    );
  };

  public render() {
    const { size } = this.state;
    return (
      <div
        className="ImagesList"
        ref={ref => (this.imagesListRef = ref)}
        onClick={() => ContextManager.switchCtx(ContextType.LEFT_NAVBAR)}
      >
        {!!size && (
          <VirtualList
            size={size}
            childSize={{ width: 150, height: 150 }}
            childCount={this.props.imagesData.length}
            childRender={this.renderImagePreview}
            overScanHeight={200}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  activeImageIndex: state.labels.activeImageIndex,
  imagesData: state.labels.imagesData,
  activeLabelType: state.labels.activeLabelType,
});

const mapDispatchToProps = {
  addImageData,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImagesList);
