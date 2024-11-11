// @not-used-yet

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRequest } from "ahooks";

import { toBeIdentified } from "src/api/image/to_be_identified";
import { getToken } from "src/utils/storage/token";
import { addImageData, updateImageData } from "src/store/labels/actionCreators";

import type { AppState } from "src/store";
import { NotificationUtil } from "src/utils/NotificationUtil";
import { ImageDataUtil } from "src/utils/ImageDataUtil";
import { fetchOriginalImageFile } from "src/api/image/download";
import { get } from "lodash";
import { ImageActions } from "src/logic/actions/ImageActions";
import { EditorActions } from "src/logic/actions/EditorActions";

interface IProps {
  current: number;
  pageSize: number;
  initialLoad: boolean;
}

const useUnidentifiedImages = ({
  current,
  pageSize,
  initialLoad = false,
}: IProps) => {
  const dispatch = useDispatch();
  const imagesData = useSelector((state: AppState) => state.labels.imagesData);

  const getPictures = async (page: number = 0, page_size: number = 20) =>
    new Promise((resolve, reject) => {
      toBeIdentified({ pageNumber: page, pageSize: page_size })
        .then(res => {
          console.log("toBeIndentified << res << ", res);
          const pics = get(res, "data.content", []);

          const imageDatas = pics.map(async (pic, index) => {
            const { imageId } = pic;
            const picFile = await fetchOriginalImageFile(imageId);

            console.log("original picFile << ", picFile);
            const _blob = new Blob([picFile], { type: "image/jpeg" });
            const _file = new File([_blob], `image_${index}.jpg`, {
              type: "image/jpeg",
            });

            return ImageDataUtil.createImageDataFromFileData(_file, pic);
          });

          Promise.allSettled(imageDatas)
            .then(synced_imageDatas => {
              const images = synced_imageDatas.map((result, index) => {
                if (result.status === "fulfilled") {
                  return result.value;
                }
                console.warn("Failed to load image", result);
                throw new Error(`Failed to load image, ${index}`);
              });

              console.log("images << ", images);

              if (page === 0) {
                dispatch(updateImageData(images));
              } else {
                dispatch(addImageData(images));
              }

              if (images.length > 0) {
                ImageActions.getImageByIndex(0);
              } else {
                EditorActions.setViewPortActionsDisabledStatus(true);
              }
            })
            .catch(err => {
              NotificationUtil.createErrorNotification({
                header: "Failed to load images",
                description: err.message,
              });
            });
        })
        .catch(reject);
    });

  const token = getToken();
  const { run, refresh } = useRequest(getPictures, {
    manual: true,
  });

  useEffect(() => {
    if (token && initialLoad) {
      run(current, pageSize);
    }
  }, [token, current, pageSize]);

  return { imagesData, fetchImages: run, refreshImages: refresh };
};

export default useUnidentifiedImages;
