import { useDispatch } from "react-redux";
import { useRequest } from "ahooks";

import { toBeIdentified } from "src/api/image/to_be_identified";
import { getToken } from "src/utils/storage/token";
import { useEffect } from "react";
import { submitNewNotification } from "src/store/notifications/actionCreators";
import { NotificationUtil } from "src/utils/NotificationUtil";

interface IProps {
  current: number;
  pageSize: number;
}

const getPictures = async (page: number, pageSize: number) =>
  new Promise((resolve, reject) => {
    toBeIdentified({ pageNumber: page, pageSize }).then(resolve).catch(reject);
  });

const useUnidentifiedImages = ({ current, pageSize }: IProps) => {
  const dispatch = useDispatch();

  const token = getToken();
  const { run } = useRequest(getPictures, {
    manual: true,
    onSuccess: res => {
      console.log("get pics success", res);
    },
  });

  useEffect(() => {
    if (token) {
      run(current, pageSize);
    } else {
      dispatch(
        submitNewNotification(
          NotificationUtil.createWarningNotification({
            header: "invalid token",
            description: "You need to login to view the images",
          })
        )
      );
    }
  }, [token, current, pageSize]);

  return {};
};

export default useUnidentifiedImages;
