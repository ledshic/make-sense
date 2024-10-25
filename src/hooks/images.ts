// @not-used-yet

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRequest } from "ahooks";

import { toBeIdentified } from "src/api/image/to_be_identified";
import { getToken } from "src/utils/storage/token";

import type { AppState } from "src/store";

interface IProps {
  current: number;
  pageSize: number;
}

const getPictures = async (page: number, pageSize: number) =>
  new Promise((resolve, reject) => {
    toBeIdentified({ pageNumber: page, pageSize }).then(resolve).catch(reject);
  });

const useUnidentifiedImages = ({ current, pageSize }: IProps) => {
  const imagesData = useSelector((state: AppState) => state.labels.imagesData);

  const token = getToken();
  const { run } = useRequest(getPictures, {
    manual: true,
  });

  useEffect(() => {
    if (token) {
      run(current, pageSize);
    }
  }, [token, current, pageSize]);

  return { imagesData };
};

export default useUnidentifiedImages;
