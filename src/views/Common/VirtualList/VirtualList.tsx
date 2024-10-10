import React from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { uploadUnidentifiedPics } from "src/api/image/upload";
import { ISize } from "../../../interfaces/ISize";
import { IRect } from "../../../interfaces/IRect";
import Scrollbars from "react-custom-scrollbars-2";
import { VirtualListUtil } from "../../../utils/VirtualListUtil";
import { IPoint } from "../../../interfaces/IPoint";
import { RectUtil } from "../../../utils/RectUtil";
import { store } from "src/index";
import { submitNewNotification } from "src/store/notifications/actionCreators";
import { NotificationUtil } from "src/utils/NotificationUtil";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface IProps {
  size: ISize;
  childCount: number;
  childSize: ISize;
  childRender: (
    index: number,
    isScrolling: boolean,
    isVisible: boolean,
    style: React.CSSProperties
  ) => any;
  overScanHeight?: number;
}

interface IState {
  viewportRect: IRect;
  isScrolling: boolean;
}

export class VirtualList extends React.Component<IProps, IState> {
  private gridSize: ISize;
  private contentSize: ISize;
  private childAnchors: IPoint[];
  private scrollbars: Scrollbars;

  constructor(props) {
    super(props);
    this.state = {
      viewportRect: null,
      isScrolling: false,
    };
  }

  public componentDidMount(): void {
    const { size, childSize, childCount } = this.props;
    this.calculate(size, childSize, childCount);
    this.setState({
      viewportRect: {
        x: 0,
        y: 0,
        width: this.props.size.width,
        height: this.props.size.height,
      },
    });
  }

  // eslint-disable-next-line
  public componentWillUpdate(nextProps: Readonly<IProps>): void {
    const { size, childSize, childCount } = nextProps;
    if (
      this.props.size.height !== size.height ||
      this.props.size.width !== size.width ||
      this.props.childCount !== childCount
    ) {
      this.calculate(size, childSize, childCount);
      this.setState({
        viewportRect: {
          x: this.scrollbars.getValues().scrollLeft,
          y: this.scrollbars.getValues().scrollTop,
          width: size.width,
          height: size.height,
        },
      });
    }
  }

  private calculate = (size: ISize, childSize: ISize, childCount: number) => {
    this.gridSize = VirtualListUtil.calculateGridSize(
      size,
      childSize,
      childCount
    );
    this.contentSize = VirtualListUtil.calculateContentSize(
      size,
      childSize,
      this.gridSize
    );
    this.childAnchors = VirtualListUtil.calculateAnchorPoints(
      size,
      childSize,
      childCount
    );
  };

  private getVirtualListStyle = (): React.CSSProperties => {
    return {
      position: "relative",
      width: this.props.size.width,
      height: this.props.size.height,
    };
  };

  private getVirtualListContentStyle = (): React.CSSProperties => {
    return {
      width: this.contentSize.width || 0,
      height: this.contentSize.height || 0,
    };
  };

  private onScrollStart = () => {
    this.setState({ isScrolling: true });
  };

  private onScrollStop = () => {
    this.setState({ isScrolling: false });
  };

  private onScroll = values => {
    this.setState({
      viewportRect: {
        x: values.scrollLeft,
        y: values.scrollTop,
        width: this.props.size.width,
        height: this.props.size.height,
      },
    });
  };

  private getChildren = () => {
    const { viewportRect, isScrolling } = this.state;
    const { overScanHeight, childSize } = this.props;
    const overScan: number = overScanHeight ? overScanHeight : 0;

    const viewportRectWithOverScan: IRect = {
      x: viewportRect.x,
      y: viewportRect.y - overScan,
      width: viewportRect.width,
      height: viewportRect.height + 2 * overScan,
    };

    return this.childAnchors.reduce(
      (children, anchor: IPoint, index: number) => {
        const childRect = Object.assign(anchor, childSize);
        const isVisible = RectUtil.intersect(
          viewportRectWithOverScan,
          childRect
        );

        if (isVisible) {
          const childStyle: React.CSSProperties = {
            position: "absolute",
            left: anchor.x,
            top: anchor.y,
            width: childSize.width || 0,
            height: childSize.height || 0,
          };

          return children.concat(
            this.props.childRender(index, isScrolling, isVisible, childStyle)
          );
        } else {
          return children;
        }
      },
      []
    );
  };

  private handleUploadPic = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files.length > 0) {
      for (const file of files) {
        console.log("uploading file", file);
        uploadUnidentifiedPics(file)
          .then(res => {
            console.log("upload pic success", res);

            store.dispatch(
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
    }
  };

  public render() {
    const displayContent =
      !!this.props.size && !!this.props.childSize && !!this.gridSize;

    return (
      <div className="VirtualList" style={this.getVirtualListStyle()}>
        <Scrollbars
          ref={ref => (this.scrollbars = ref)}
          onScrollFrame={this.onScroll}
          onScrollStart={this.onScrollStart}
          onScrollStop={this.onScrollStop}
          autoHide={true}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              justifyContent: "center",
              padding: "12px 36px",
            }}
          >
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload files
              <VisuallyHiddenInput
                type="file"
                onChange={this.handleUploadPic}
                multiple
              />
            </Button>
          </div>

          {displayContent && (
            <div
              className="VirtualListContent"
              style={this.getVirtualListContentStyle()}
            >
              {this.getChildren()}
            </div>
          )}
        </Scrollbars>
      </div>
    );
  }
}
